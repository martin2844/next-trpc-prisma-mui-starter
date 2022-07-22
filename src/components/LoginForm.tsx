import Link from "next/link";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { CreateUserInput } from "../schema/User.schema";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { useState } from "react";
import userStore from "../stores/user.store";

//This is a fp component that will verify the token and redirect to the home page if the token is valid.
function VerifyToken({ hash }: { hash: string }) {
  const router = useRouter();
  console.log("There is a hash " + hash);
  const { data, isLoading } = trpc.useQuery([
    "users.verify-otp",
    {
      hash: hash,
    },
  ]);

  if (isLoading) {
    return <p>Verifying...</p>;
  }
  userStore((state: any) => state.getSession)();
  if (data?.redirect?.includes("login")) {
    console.log("Data Before Redirect", data);
    router.push(data.redirect);
  } else {
    router.push("/");
  }
  return <p>Redirecting...</p>;
}

const LoginForm = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<CreateUserInput>();

  const [success, setSuccess] = useState(false);

  //Get Mutate from the trpc route. This 'mutate' function will generate a token and send it by email as a link.
  const { mutate, error } = trpc.useMutation(["users.request-otp"], {
    onSuccess: () => {
      setSuccess(true);
    },
  });

  //On Submit we call mutate on the form values, add the asPath to the redirect in case we are logging in from a different page.
  //We also redirect to the home page if no asPath is recorded.
  function onSubmit(values: CreateUserInput) {
    mutate({ ...values, redirect: router.asPath });
  }
  //if we have a hash at the browser bar url, we verify the token with the verifyToken component.
  const hash = router.asPath.split("#token=")[1];
  if (hash) {
    return <VerifyToken hash={hash} />;
  }

  //If we are not logged in, we show the login form.
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        {success && <p>Check your email</p>}
        <h1>Login</h1>
        <input
          type="email"
          placeholder="email@email.com"
          {...register("email")}
        />
        <br />
        <Button type="submit">Login</Button>
      </form>
      <Link href="/register">register</Link>
    </>
  );
};

export default LoginForm;
