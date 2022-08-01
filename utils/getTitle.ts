export default function getTitle(title: string) {
  return title + ` | ${process.env.NEXT_PUBLIC_APP_NAME}`;
}
