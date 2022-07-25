import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { ApiError, UserCredentials } from "@supabase/supabase-js";
import { Alert, Button, Form, Input, Typography } from "antd";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

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
        <title>Iniciar sesión | Recipe Cost Calculator</title>
      </Head>

      <header>
        <Typography.Title className="text-center">
          Iniciar sesión
          <br />
          <span className="text-xl">Recipe Cost Calculator</span>
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

        <Link href="/signup">
          <a className="block mt-5 text-center">
            ¿No tienes cuenta? Registrarse
          </a>
        </Link>
      </Form>
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user } = await getUser(ctx);
  if (user) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
};
