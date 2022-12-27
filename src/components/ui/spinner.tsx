import type { ComponentPropsWithoutRef } from "react";

export function Spinner(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <style>
        {
          ".spinner_98HH{animation:spinner_mnRT 1.6s cubic-bezier(0.52,.6,.25,.99) infinite}.spinner_roCJ{animation-delay:.2s}.spinner_q4Oo{animation-delay:.4s}@keyframes spinner_mnRT{0%{r:0;opacity:1}75%,100%{r:11px;opacity:0}}"
        }
      </style>
      <circle className="spinner_98HH" cx="12" cy="12" r="0" />
      <circle className="spinner_98HH spinner_roCJ" cx="12" cy="12" r="0" />
      <circle className="spinner_98HH spinner_q4Oo" cx="12" cy="12" r="0" />
    </svg>
  );
}
