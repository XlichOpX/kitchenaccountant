import type { PropsWithChildren } from "react";
import { Navbar } from "./navbar";

export function MainLayout(props: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-2">{props.children}</main>
    </>
  );
}
