import dotenv from "dotenv";
import app from "./app";
import './routes';

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 9000;

app.listen(port, () => {
  console.log(`Dreamy Studio API listening on port http://localhost:${port}`);
});