import { type NextPage } from "next";
import Head from "next/head";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { ColorLogo } from "~/components/color-logo";
import { buttonClasses } from "~/components/ui/button";
import { env } from "~/env/client.mjs";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="description" content="Gestor de recetas de cocina" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <ColorLogo className="m-4 h-64 w-64" />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 ">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Kitchen<span className="text-amber-600">Accountant</span>
          </h1>
          <p className="text-center text-lg">
            ¡Un sencillo gestor de recetas que te permitirá calcular sus costos
            de manera rápida!
          </p>
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            <AppLink href="/ingredients" label="Ir a la aplicación" />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AppLink = ({
  label,
  href,
}: {
  label: string;
  href: LinkProps["href"];
}) => (
  <Link className={buttonClasses({ size: "lg" })} href={href}>
    {label} →
  </Link>
);
