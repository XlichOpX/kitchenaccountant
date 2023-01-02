import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { env } from "~/env/client.mjs";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>{env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="description" content="Gestor de recetas de cocina" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Kitchen<span className="text-[hsl(280,100%,70%)]">Accountant</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <AppLink href="/ingredients" label="Ingredientes" />
            <AppLink href="/recipes" label="Recetas" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && (
          <span>Ha iniciado sesión como {sessionData.user?.name}</span>
        )}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Cerrar sesión" : "Iniciar sesión"}
      </button>
    </div>
  );
};

const AppLink = ({
  description,
  label,
  href,
}: {
  description?: string;
  label: string;
  href: LinkProps["href"];
}) => (
  <Link
    className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
    href={href}
  >
    <h3 className="text-2xl font-bold">{label} →</h3>
    {description && <div className="text-lg">{description}</div>}
  </Link>
);
