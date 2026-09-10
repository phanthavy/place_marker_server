import express = require("express");
import cors = require("cors");
import morgan = require("morgan");
import helmetImport = require("helmet");
import fs = require("node:fs");
import path = require("node:path");
require("dotenv").config();

const { readdirSync } = fs;

const app = express();
const PORT = process.env.PORT;
const helmet = helmetImport.default;

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = (process.env.ALLOWED_ORIGIN ?? "").split(",").map((o)=> o.trim()).filter(Boolean)

      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

const routesPath = path.join(__dirname, "./routes/");

readdirSync(routesPath, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .forEach((folder) => {
    const folderPath = path.join(routesPath, folder.name);

    readdirSync(folderPath)
      .filter((file) => file.endsWith(".ts"))
      .forEach((file: string) => {
        app.use("/api/" + folder.name, require(path.join(folderPath, file)));
      });
  });

app.listen(PORT, () => console.log(`server listening port ${PORT}`));
