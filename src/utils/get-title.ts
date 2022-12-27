import { env } from "~/env/client.mjs";

export function getTitle(title: string) {
  return `${title} | ${env.NEXT_PUBLIC_APP_NAME}`;
}
