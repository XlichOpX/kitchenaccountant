import { Spin } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Redirecting: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/collections");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Spin />
    </div>
  );
};

export default Redirecting;
