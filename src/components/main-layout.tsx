import type { PropsWithChildren } from "react";
import { Navbar } from "./navbar";
import { RequireAuth } from "./require-auth";

export function MainLayout(props: PropsWithChildren) {
  return (
    <RequireAuth>
      <Navbar />
      <main className="container mx-auto p-2">{props.children}</main>
    </RequireAuth>
  );
}
