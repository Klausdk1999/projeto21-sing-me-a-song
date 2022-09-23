import app from "../../src/app";
import {prisma} from "../../src/database"
import supertest from "supertest";
import {createRecomendation, create20Recomendations} from "../factory/recomendationfactory"

beforeEach(async () =>{
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
})

describe("Testing route post /recommendations", ()=>{

    it("return 201 - success create recommendation", async () =>{

        const postRecommendation = await createRecomendation();
        const result = await supertest(app).post("/recommendations").send(postRecommendation);

        const verifyCreate = await prisma.recommendation.findUnique({
            where: {name: postRecommendation.name}
        });

        expect(result.status).toBe(201);
        expect(verifyCreate).not.toBeNull();

    });

    it("return 422 - wrong input: null invalid name", async () =>{

        const postRecommendation = await createRecomendation();
        const result = await supertest(app).post("/recommendations").send({...postRecommendation, name:null});

        expect(result.status).toBe(422);

    });

    it("return 422 - wrong input: null invalid youtube link", async () =>{

        const postRecommendation = await createRecomendation();
        const result = await supertest(app).post("/recommendations").send({...postRecommendation, youtubeLink:null});

        expect(result.status).toBe(422);

    });

    it("return 422 - wrong input: invalid youtube link", async () =>{

        const postRecommendation = await createRecomendation();
        const result = await supertest(app).post("/recommendations").send({...postRecommendation, youtubeLink: "https://www.youtube.com/watch?v=mpaPBCBjSVc"});

        expect(result.status).toBe(422);

    });

    it("return 422 - wrong input: empty body", async () =>{

        const result = await supertest(app).post("/recommendations").send({});

        expect(result.status).toBe(422);

    });

    it("return 409 - already has a recommendations with this name", async () => {

		const postRecommendation = await createRecomendation();

		await supertest(app).post("/recommendations").send(postRecommendation);
		const result = await supertest(app).post("/recommendations").send(postRecommendation);

		expect(result.status).toBe(409);
	});

});

describe("Testing route get /recommendations", () => {

	it("return 200 - Posted twenty recommendations, but need to get just ten", async () => {

		const recommendationArr = await create20Recomendations();

        for(let i=0;i<recommendationArr.length;i++){
           await supertest(app).post("/recommendations").send(recommendationArr[i]);
        }

		const getResult = await supertest(app).get("/recommendations").send();

		expect(getResult.status).toBe(200);
		expect(getResult.body).toBeInstanceOf(Array);
		expect(getResult.body.length).not.toBeGreaterThan(10);
	});

});

describe("Test in route get /recommendations/:id", () => {

	it("return 200 - need to get the correct recommendations with valid id", async () => {
        await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;

		await createRecomendation();

		const result = await supertest(app).get(`/recommendations/1`).send();

		expect(result.status).toBe(200);
		expect(result.body).toBeInstanceOf(Object);
		expect(result.body).toEqual(1);
	});

	it("return 404 - nonexistent id", async () => {
		const result = await supertest(app).get("/recommendations/123456789").send();

		expect(result.status).toBe(404);
	}); 

});