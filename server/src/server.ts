import app from "./app";

const port = process.env.PORT ? Number(process.env.PORT) : 9000;

app.listen(port, () => {
  console.log(`Dreamy Studio API listening on port http://localhost:${port}`);
});