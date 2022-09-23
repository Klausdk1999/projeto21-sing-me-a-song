import { faker } from "@faker-js/faker"
import {prisma} from "../../src/database"
import supertest from "supertest";

export async function createRecomendation(){

    return{
        name: faker.lorem.words(),
        youtubeLink: "https://www.youtube.com/watch?v=17ozSeGw-fY"
    }
}

export async function create20Recomendations(){

    let createManyRecomendations = [];

    for (let i = 0; i < 19; i++) {
        const create20recomendations = await createRecomendation();
        createManyRecomendations.push(create20recomendations)
    }

    return createManyRecomendations;
}