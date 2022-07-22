import nodemailer from "nodemailer";

export async function sendLoginEmail({
  email,
  url,
  token,
}: {
  email: string;
  url: string;
  token: string;
}) {
  console.log("CLICK HERE: " + `${url}/login#token=${token}`);
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <fred@foo.com>',
    to: email,
    subject: "Login",
    html: `Login by clicking  <a href="${url}/login#token=${token}">here</a>`,
  });

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
