import { useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { Spinner } from "./ui/spinner";

export function RequireAuth(props: PropsWithChildren) {
  const { status } = useSession({ required: true });
  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return <>{props.children}</>;
}
