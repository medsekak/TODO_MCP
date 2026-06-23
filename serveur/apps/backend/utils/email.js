import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Vérifiez votre email",
    html: `
      <h2>Bienvenue !</h2>
      <p>Clique sur le lien pour activer ton compte :</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Ce lien expire dans 24h.</p>
    `,
  });
};