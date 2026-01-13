import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const __dirname = path.resolve();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); //this adds auth field to req object

app.use("/api/inngest", serve({ client: inngest, functions }));

//connecting to mongodb
import { connectDB } from "./lib/db.js";
import { protectRoute } from "./middlewares/protectRoute.js";
import chatRoute from "./routes/chat.route.js";
import sessionRoute from "./routes/session.route.js";

app.get("/api/health", (req, res) => {
  res.send("api is running");
});

app.use("/api/auth", protectRoute, (req, res) => {
  res.json({ message: "auth is running", user: req.user });
});

app.use("/api/chat", protectRoute, chatRoute);
app.use("/api/sessions", protectRoute, sessionRoute);

//make our app ready for production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const startServer = () => {
  try {
    app.listen(ENV.PORT, async () => {
      await connectDB();
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
