import express from "express";
import { config } from "dotenv";
import cors from "cors";
config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
