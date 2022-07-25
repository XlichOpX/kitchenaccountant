import { useUser } from "@supabase/auth-helpers-react";
import { Button } from "antd";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="p-6">
      <div className="mb-3">Hola, {user?.email}</div>
      <Button type="primary" onClick={() => router.push("/api/auth/logout")}>
        Cerrar sesión
      </Button>
    </div>
  );
};

export default Home;
