import type { RefObject } from "react";
import { useEffect } from "react";

export function useClickOutside({
  active,
  ref,
  callback,
}: {
  active: boolean;
  ref: RefObject<HTMLElement>;
  callback: (evt: MouseEvent) => void;
}) {
  useEffect(() => {
    function handleClick(evt: MouseEvent) {
      if (!ref.current?.contains(evt.target as Node)) {
        callback(evt);
        document.removeEventListener("click", handleClick, true);
      }
    }

    if (active) {
      document.addEventListener("click", handleClick, true);
    }

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [active, callback, ref]);
}
