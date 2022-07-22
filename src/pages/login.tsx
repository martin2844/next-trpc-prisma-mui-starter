import dynamic from "next/dynamic";
//Makes LoginForm not render on the server so that props do not mismatch on hydration.
const LoginForm = dynamic(() => import("../components/LoginForm"), {
  ssr: false,
});

const Login = () => {
  return <LoginForm />;
};

export default Login;
