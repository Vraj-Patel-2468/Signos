import dotenv from "dotenv";
import express, {Request, Response} from "express";
import {Server, Socket} from "socket.io";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import teamRoutes from "./routes/team.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import communityRoutes from "./routes/community.route";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
));

const http = require("http").createServer(app);
const io = new Server(http, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.get("/api", (req: Request, res: Response) => {
    res.status(200).send("Backend is connnected.");
});

//Routes
app.use("/api/auth", authRoutes);
//Protected Routes
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/communities", communityRoutes);


io.on("connection", (socket: Socket) => {
  console.log("a user connected");
});

http.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});
