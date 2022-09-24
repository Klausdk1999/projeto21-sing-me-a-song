import * as testRepository from "../repositories/testRepository";

export async function truncate() {
	await testRepository.truncate();
}