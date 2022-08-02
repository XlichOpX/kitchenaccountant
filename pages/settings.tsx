import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Button, Card, Form, Input, message, PageHeader } from "antd";
import { Header, PageContent } from "components";
import { useSettings } from "hooks";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Settings } from "services/settings";
import getTitle from "utils/getTitle";
import { NextPageWithLayout } from "./_app";

const Settings: NextPageWithLayout = () => {
  const { settings, updateSettings } = useSettings();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    form.setFieldsValue(settings);
  }, [settings, form]);

  const onFinish = async (values: Settings) => {
    setIsSubmitting(true);
    try {
      await updateSettings(values);
      message.success("Cambios guardados");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{getTitle("Ajustes")}</title>
      </Head>

      <Header>
        <PageHeader title="Ajustes" />
      </Header>

      <PageContent>
        <Card title="Generales">
          <Form name="settings" onFinish={onFinish} form={form}>
            <Form.Item name="currency_symbol" label="Símbolo de moneda">
              <Input maxLength={4} className="w-[7ch]" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Guardar cambios
            </Button>
          </Form>
        </Card>
      </PageContent>
    </>
  );
};

Settings.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Settings;

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });
