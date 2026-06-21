import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;



// l'etape suivante je vais creer des routes pour auth et connect avec la base de donnees et je vais creer un dossier pour les models et les controllers pour l'authentification et la gestion des taches.