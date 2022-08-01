import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { ApiError, UserCredentials } from "@supabase/supabase-js";
import { Alert, Button, Form, Input, Typography } from "antd";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import getTitle from "utils/getTitle";
import Image from "next/image";
import logo from "public/color-logo.svg";

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const SignUp: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async ({ email, password }: UserCredentials) => {
    setIsSubmitting(true);
    const { error } = await supabaseClient.auth.signUp({ email, password });
    setIsSubmitting(false);

    if (!error) {
      router.push("/login");
      return;
    }

    setError(error);
  };

  return (
    <div className="h-screen max-w-sm mx-auto flex flex-col justify-center p-5">
      <Head>
        <title>{getTitle("Registrarse")}</title>
      </Head>

      <header>
        <div className="text-center">
          <Image src={logo} alt="KitchenAccountant logo" />
        </div>

        <Typography.Title className="text-center">
          <span className="text-xl">{appName}</span>
          <br />
          Registrarse
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

        <Form.Item
          name="passwordConfirm"
          rules={[
            { required: true, message: "Confirma tu contraseña" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Las contraseñas no coinciden")
                );
              },
            }),
          ]}
          dependencies={["password"]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirmar contraseña"
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" block disabled={isSubmitting}>
          Registrarse
        </Button>

        <Link href="/login">
          <a className="block mt-5 text-center">
            ¿Ya tienes cuenta? Iniciar sesión
          </a>
        </Link>
      </Form>
    </div>
  );
};

export default SignUp;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user } = await getUser(ctx);
  if (user) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
};
