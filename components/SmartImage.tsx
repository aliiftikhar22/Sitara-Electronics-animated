import Image, { type ImageProps } from "next/image";
import { isDataUrl } from "@/lib/utils";

type SmartImageProps = Omit<ImageProps, "src"> & { src: string; alt: string };

/**
 * Real product photos in Firestore are base64 data URIs (the existing admin
 * panel embeds them to avoid Firebase Storage). next/image's optimizer can't
 * usefully process those, so data URIs render as a plain <img> while local
 * /public paths keep next/image's optimization.
 */
export default function SmartImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  ...rest
}: SmartImageProps) {
  if (isDataUrl(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- base64 data URI, next/image can't optimize it
        <img
          src={src}
          alt={alt}
          className={className}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
          decoding="async"
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element -- base64 data URI, next/image can't optimize it
      <img
        src={src}
        alt={alt}
        className={className}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      {...rest}
    />
  );
}
