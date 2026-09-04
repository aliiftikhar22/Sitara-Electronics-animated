import type { Metadata } from "next";
import TrackOrderClient from "@/components/TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your Sitara Electronics order status in real time.",
};

export default async function TrackOrderPage(props: PageProps<"/track-order">) {
  const searchParams = await props.searchParams;
  const id = searchParams.id;

  return <TrackOrderClient initialId={typeof id === "string" ? id : undefined} />;
}
