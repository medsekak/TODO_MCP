import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',          // Serveur SMTP de Gmail
  port: 465,                       // Port recommandé pour SSL
  secure: true,                    // true pour le port 465 (SSL)
  auth: {
    user: process.env.GMAIL_USER,         // Ton adresse Gmail complète (ex: moncompte@gmail.com)
    pass: process.env.GMAIL_APP_PASSWORD, // Un "App Password" Google (16 caractères, 2FA requise) — PAS ton mot de passe Gmail
  },
});


export const sendVerificationEmail = async (userEmail, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationLink = `${clientUrl}/verify-email?token=${token}`;

  const mailOptions = {
    // Avec Gmail, l'expéditeur doit être ton adresse Gmail (celle de GMAIL_USER)
    from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
    to: userEmail, // L'adresse de l'utilisateur (pendant les tests, ce doit être TON propre email)
    subject: 'Vérification de votre compte TODO App',
    html: `
      <div style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px; border-radius: 16px; max-width: 500px; margin: auto;">
        <h2 style="color: #6366f1;">Bienvenue sur TODO App ! 🚀</h2>
        <p style="color: #94a3b8;">Merci de votre inscription. Cliquez sur le bouton ci-dessous pour activer votre compte :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Vérifier mon e-mail
          </a>
        </div>
        <p style="font-size: 12px; color: #64748b;">Ce lien expirera dans 5 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("E-mail de vérification envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    throw error;
  }
};