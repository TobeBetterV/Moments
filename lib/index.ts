export function url(path = "") {
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  return new URL(path, baseUrl);
}
