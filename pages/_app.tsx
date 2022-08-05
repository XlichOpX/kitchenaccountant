import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { UserProvider } from "@supabase/auth-helpers-react";
import { ConfigProvider } from "antd";
import "antd/dist/antd.css";
import esES from "antd/lib/locale/es_ES";
import { SettingsProvider } from "contexts/SettingsContext";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import "../styles/globals.css";

export type NextPageWithLayout<P = {}, IP = {}> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <UserProvider supabaseClient={supabaseClient}>
      <SettingsProvider>
        <ConfigProvider locale={esES}>
          <Component {...pageProps} />
        </ConfigProvider>
      </SettingsProvider>
    </UserProvider>
  );
}

export default MyApp;
