import Link from "next/link";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { CreateUserInput } from "../schema/User.schema";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

const Register = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const { mutate, error } = trpc.useMutation(["users.register-user"], {
    onSuccess: () => {
      router.push("/login");
    },
  });

  function onSubmit(values: CreateUserInput) {
    mutate(values);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <h1>Register</h1>
        <input
          type="email"
          placeholder="email@email.com"
          {...register("email")}
        />
        <br />
        <input type="text" placeholder="name" {...register("name")} />
        <Button type="submit">Submit</Button>
      </form>
      <Link href="/login">login</Link>
    </>
  );
};

export default Register;
