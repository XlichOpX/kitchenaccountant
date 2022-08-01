import {
  GoogleCircleFilled,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { ApiError, UserCredentials } from "@supabase/supabase-js";
import { Alert, Button, Form, Input, Space, Typography } from "antd";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import getTitle from "utils/getTitle";
import Image from "next/image";
import logo from "public/color-logo.svg";

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const Login: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async ({ email, password }: UserCredentials) => {
    setIsSubmitting(true);
    const { error } = await supabaseClient.auth.signIn({ email, password });
    setIsSubmitting(false);

    if (!error) {
      router.push("/");
      return;
    }

    setError(error);
  };

  return (
    <div className="h-screen max-w-sm mx-auto flex flex-col justify-center p-5">
      <Head>
        <title>{getTitle("Iniciar sesión")}</title>
      </Head>

      <header>
        <div className="text-center">
          <Image src={logo} alt="KitchenAccountant logo" />
        </div>

        <Typography.Title className="text-center">
          <span className="text-xl">{appName}</span>
          <br />
          Iniciar sesión
        </Typography.Title>
      </header>

      {error && <Alert type="error" message={error.message} className="my-3" />}

      <Form name="signup" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Introduce tu correo electrónico" },
            { type: "email", message: "Debe ser un correo electrónico válido" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Correo electrónico" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Introduce tu contraseña" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block disabled={isSubmitting}>
          Iniciar sesión
        </Button>
      </Form>

      <Space direction="vertical" className="flex mt-3">
        <Button icon={<GoogleCircleFilled />} block onClick={signInWithGoogle}>
          Iniciar sesión con Google
        </Button>
      </Space>

      <Link href="/signup">
        <a className="block mt-5 text-center">¿No tienes cuenta? Registrarse</a>
      </Link>
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user } = await getUser(ctx);
  if (user) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
};

async function signInWithGoogle() {
  const { user, session, error } = await supabaseClient.auth.signIn(
    {
      provider: "google",
    },
    { redirectTo: `${process.env.NEXT_PUBLIC_VERCEL_URL}/redirecting` }
  );
}
