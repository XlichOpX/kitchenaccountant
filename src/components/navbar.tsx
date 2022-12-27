import * as Collapsible from "@radix-ui/react-collapsible";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { FaBook } from "react-icons/fa";
import { GiFlour } from "react-icons/gi";
import { IoLogOutSharp } from "react-icons/io5";
import { ColorLogo } from "~/components/color-logo";
import { env } from "~/env/client.mjs";
import { useClickOutside } from "~/hooks/useClickOutside";

const links = [
  {
    label: "Ingredientes",
    href: "/ingredients",
    icon: <GiFlour className="h-6 w-6" />,
  },
  { label: "Recetas", href: "/recipes", icon: <FaBook /> },
];

export function Navbar() {
  return (
    <header className="sticky top-0 bg-slate-800 text-white shadow">
      <div className="container relative mx-auto flex h-14 items-center justify-between p-2">
        <Link href="/" className="flex items-center gap-2">
          <ColorLogo className="h-10 w-10" />
          <span className="text-xl font-medium">
            {env.NEXT_PUBLIC_APP_NAME}
          </span>
        </Link>

        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden md:block">
      <ul className="flex items-center gap-4">
        {links.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
              {icon}
              {label}
            </Link>
          </li>
        ))}
        <li>
          <LogoutBtn className="transition-transform hover:scale-105" />
        </li>
      </ul>
    </nav>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  useClickOutside({
    active: open,
    ref: contentRef,
    callback: () => setOpen(false),
  });

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="flex items-center justify-center md:hidden"
    >
      <Collapsible.Trigger asChild>
        <button title={open ? "Cerrar menú" : "Abrir menú"}>
          {open ? <BiX className="h-6 w-6" /> : <BiMenu className="h-6 w-6" />}
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content asChild>
        <nav
          ref={contentRef}
          className="fixed top-14 left-0 right-0 overflow-hidden bg-slate-700 shadow data-[state=open]:animate-slide-collapsible-down data-[state=closed]:animate-slide-collapsible-up"
        >
          <ul className="flex flex-col">
            {links.map(({ href, label, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="container mx-auto flex items-center gap-2 px-2 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {icon}
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <LogoutBtn className="container mx-auto px-2 py-2 hover:bg-white/10" />
            </li>
          </ul>
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function LogoutBtn({ className }: { className?: string }) {
  return (
    <button
      className={"flex items-center gap-2" + (className ? ` ${className}` : "")}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <IoLogOutSharp className="h-6 w-6" />
      Salir
    </button>
  );
}
