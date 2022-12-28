import debounce from "just-debounce";
import { useMemo, useState } from "react";

export function useDebouncedState<T>(initialValue: T, delayInMs = 275) {
  const [value, setValue] = useState(initialValue);
  const debouncedSetValue = useMemo(
    () => debounce(setValue, delayInMs),
    [delayInMs]
  );
  return [value, debouncedSetValue] as const;
}
