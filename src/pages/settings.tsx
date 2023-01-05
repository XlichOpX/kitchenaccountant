import { type NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "~/components/main-layout";
import { SettingsForm } from "~/components/settings/settings-form";

import { getTitle } from "~/utils/get-title";
import { trpc } from "~/utils/trpc";

const Settings: NextPage = () => {
  const { data: settings } = trpc.auth.getUserSettings.useQuery();
  return (
    <>
      <Head>
        <title>{getTitle("Ajustes")}</title>
      </Head>

      <MainLayout>
        <h1 className="h1">Ajustes</h1>

        {settings && (
          <SettingsForm
            defaultValues={{ currencySymbol: settings.currencySymbol }}
          />
        )}
      </MainLayout>
    </>
  );
};

export default Settings;
