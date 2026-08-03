import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.APP_PORT || process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Library API listening on ${PORT}`));
