import { Router } from "express";
import * as e2eController from "../controllers/testController";

const e2eRouter = Router();

e2eRouter.post("/e2e/cleardatabase", e2eController.truncate);

export default e2eRouter;