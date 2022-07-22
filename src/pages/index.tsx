import type { NextPage } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";

import Button from "@mui/material/Button";
import Layout from "../components/Layout/Layout";

const Title = dynamic(() => import("../components/Title"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <Layout>
      <Title />
      <div style={{ display: "flex" }}>
        <Link href="/login">
          <Button variant="contained" style={{ marginRight: "10px" }}>
            Login
          </Button>
        </Link>
        <Link href={"/register"}>
          <Button variant="contained">Register</Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Home;
