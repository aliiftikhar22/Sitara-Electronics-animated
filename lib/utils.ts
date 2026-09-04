export function formatPKR(amount: number | null | undefined): string {
  return "Rs " + Number(amount ?? 0).toLocaleString("en-PK");
}

export function isDataUrl(src: string): boolean {
  return src.startsWith("data:");
}
