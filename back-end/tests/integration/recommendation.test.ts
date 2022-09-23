import app from "../../src/app";
import {prisma} from "../../src/database"
import supertest from "supertest";
import {CreateRecommendation} from "../factory/recommendationfactory"

beforeEach(async () =>{
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
})

describe("Testing route post /recommendations", ()=>{

    it("return 201 - success create recommendation", async () =>{

        const postRecommendation = await CreateRecommendation;
        const result = await supertest(app).post("/recommendations").send(postRecommendation);

        const verifyCreate = await prisma.recommendation.findUnique({
            where: {name: postRecommendation.name}
        });

        expect(result.status).toBe(201);
        expect(verifyCreate).not.toBeNull();

    });

    it("return 422 - wrong input: null invalid name", async () =>{

        const postRecommendation = await CreateRecommendation;
        const result = await supertest(app).post("/recommendations").send({...postRecommendation, name:null});

        expect(result.status).toBe(422);

    });

    it("return 422 - wrong input: null invalid youtube link", async () =>{

        const postRecommendation = await CreateRecommendation;
        const result = await supertest(app).post("/recommendations").send({...postRecommendation, youtubeLink:null});

        expect(result.status).toBe(422);

    });

    it("return 422 - wrong input: invalid youtube link", async () =>{

        const postRecommendation = await CreateRecommendation;
        const result = await supertest(app).post("/recommendations").send({...postRecommendation, youtubeLink: "https://www.youtube.com/watch?v=mpaPBCBjSVc"});

        expect(result.status).toBe(422);

    });

    it("return 422 - wrong input: empty body", async () =>{

        const result = await supertest(app).post("/recommendations").send({});

        expect(result.status).toBe(422);

    });

    it("return 409 - already has a recommendations with this name", async () => {

		const postRecommendation = await CreateRecommendation;

		await supertest(app).post("/recommendations").send(postRecommendation);
		const result = await supertest(app).post("/recommendations").send(postRecommendation);

		expect(result.status).toBe(409);
	});

});