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
        const result = await supertest(app).post("/recommendations").send({...postRecommendation, youtubeLink: "https://www.yobe.com"});

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

		const newRecommendation = await createRecomendation();
        
        await prisma.recommendation.create({
            data: newRecommendation
        });

		const result = await supertest(app).get(`/recommendations/1`).send();

		expect(result.status).toBe(200);
		expect(result.body).toBeInstanceOf(Object);
		expect(result.body.id).toEqual(1);
	});

	it("return 404 - nonexistent id", async () => {
		const result = await supertest(app).get("/recommendations/123456789").send();

		expect(result.status).toBe(404);
	}); 

});

describe("Test in route post /recommendations/:id/upvote", () => {

	it("return 200 - if have a valid id && score greater than 0", async () => {

        const newRecommendation = await createRecomendation();

        const recommendationById = await prisma.recommendation.create({
            data: newRecommendation,
        });
		
		const result = await supertest(app).post(`/recommendations/${recommendationById.id}/upvote`).send();
		const recommendationUpvoted = await prisma.recommendation.findUnique({
			where: { id: recommendationById.id },
		});

		expect(result.status).toBe(200);
		expect(recommendationUpvoted.score).toBeGreaterThan(0);
	});

    it("return 404 - if have a invalid id", async () => {

		const result = await supertest(app).post("/recommendations/123456789/upvote").send();

		expect(result.status).toBe(404);
		expect(result.text).toBe("");
	});

});

describe("Test in route post /recommendations/:id/downvote", () => {

	it("return 200 - valid id and negative votes", async () => {

		const newRecommendation = await createRecomendation();

        const recommendationById = await prisma.recommendation.create({
            data: newRecommendation,
        });

		const result = await supertest(app).post(`/recommendations/${recommendationById.id}/downvote`).send();

		const recommendationDownvoted = await prisma.recommendation.findUnique({
			where: { id: recommendationById.id },
		});

		expect(result.status).toBe(200);
		expect(recommendationDownvoted.score).toBeLessThan(0);
	});

    it("return 200 - valid id and delete recommendation with -5 score", async () => {

		const newRecommendation = await createRecomendation();

        const recommendationById = await prisma.recommendation.create({
            data: { ...newRecommendation, score: -5 },
        });

		const result = await supertest(app).post(`/recommendations/${recommendationById.id}/downvote`).send();
		const RecommendationDeleted = await prisma.recommendation.findUnique({
			where: { id: recommendationById.id }
		});

		expect(result.status).toBe(200);
		expect(RecommendationDeleted).toBeNull();
	});
});

describe("Test in route get /recommendations/random", () => {
	
	it("return 200 - get a object", async () => {
		const recommendationHighScore = await createRecomendation();
	    const recommendationLowScore = await createRecomendation();

	    await prisma.recommendation.create({
		    data: { ...recommendationHighScore, score: 200 },
	    });

	    await prisma.recommendation.create({
		    data: { ...recommendationLowScore, score: 5 },
	    });

		const result = await supertest(app).get("/recommendations/random").send();

		expect(result.status).toBe(200);
		expect(result.body).toBeInstanceOf(Object);
	});

    it("return 404 - no song posted", async () => {

		const result = await supertest(app).get("/recommendations/random").send();

		expect(result.status).toBe(404);
		expect(result.body).toBeInstanceOf(Object);
	});

});

describe("Test in route get /recommendations/top/amount", () => {

	it("return 200 - return array of songs with valid params", async () => {

		const recommendationArr = await create20Recomendations();

        for(let i=0;i<recommendationArr.length;i++){
           await supertest(app).post("/recommendations").send(recommendationArr[i]);
        }

		const randomAmount = 3;
		const result = await supertest(app).get(`/recommendations/top/${randomAmount}`).send();

		expect(result.status).toBe(200);
        expect(result.body.length).toBe(randomAmount);
		expect(result.body).toBeInstanceOf(Array);
	});

    it("return 200 - array in the correct order", async () => {

        await prisma.$executeRaw`TRUNCATE TABLE recommendations`;

		const recommendationArr = await create20Recomendations();

        for(let i=1;i<recommendationArr.length;i++){
           await supertest(app).post("/recommendations").send(recommendationArr[i]);
        }

        await prisma.recommendation.create({data:{
            name: 'High Scorer',
            youtubeLink: 'https://www.youtube.com/watch?v=17ozSeGw-fY',
            score: 10
        }});

		const randomAmount = 5;
        
		const result = await supertest(app).get(`/recommendations/top/${randomAmount}`).send();

        console.log(result.body)
		let isFirstItemHighScore = false;

		if (result.body[0].score > result.body[1].score) {
			isFirstItemHighScore = true;
		}

		expect(result.status).toBe(200);
        expect(result.body.length).toBe(randomAmount);
		expect(result.body).toBeInstanceOf(Array);
		expect(isFirstItemHighScore).toBe(true);
	});

	it("returns 500 with invalid params", async () => {

		const recommendationArr = await create20Recomendations();

        for(let i=0;i<recommendationArr.length;i++){
           await supertest(app).post("/recommendations").send(recommendationArr[i]);
        }

		const wrongRandomAmount = "teste";
		const result = await supertest(app).get(`/recommendations/top/${wrongRandomAmount}`).send();

		expect(result.status).toBe(500);
	});

});

afterAll(async () => {
	await prisma.$disconnect();
});