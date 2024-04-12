import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    try {
      app.listen(process.env.PORT || 3000, () => {
        console.log(`Listening to port ${process.env.PORT}`);
      });
    } catch (error) {
      console.log("Listening to port problem", error);
      console.log(error.message);
    }
  })
  .catch((err) => {
    console.log(err.message);
  });
