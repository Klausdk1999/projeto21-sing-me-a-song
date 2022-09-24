import { Request, Response } from "express";
import * as testService from "../services/testService";

export async function truncate(req: Request, res: Response) {
	await testService.truncate();

	res.sendStatus(202);
}