import { faker } from "@faker-js/faker"

const name =  faker.lorem.words(3);
const youtubeLink = "https://youtu.be/mpaPBCBjSVc"

const name2 =  "Second most voted";
const youtubeLink2 = "https://youtu.be/6k8es2BNloE"

const name3 =  faker.lorem.words(4);
const youtubeLink3 = "https://youtu.be/6yCIDkFI7ew"

const name4 = "Most voted"
const youtubeLink4 = "https://youtu.be/dsMU2pOCBuw"

describe("HomePage", () => {

    it("Should Post Video", () => {
        
        cy.visit("http://localhost:3000");

        cy.request("POST", "http://localhost:4000/e2e/cleardatabase");

        cy.get("#name").type(`${name}`);
        cy.get("#youtubeLink").type(`${youtubeLink}`);

        cy.intercept("POST", "http://localhost:4000/recommendations").as(
            "postRecommendation"
        );

        cy.get("#submit").click();
        //cy.wait("@postRecommendation");

        cy.contains(name);
        for(let i = 0; i<6; i++){
            cy.get("#upvote").click();
        }
        cy.contains("6")
        for(let i = 0; i<4; i++){
            cy.get("#downvote").click();
        }
        cy.contains("2");
		cy.get("#urlname").should("contain.text", name);

        cy.get("#name").type(`${name2}`);
        cy.get("#youtubeLink").type(`${youtubeLink2}`);
        cy.intercept("POST", "http://localhost:4000/recommendations").as(
            "postRecommendation"
        );
        cy.get("#submit").click();
        //cy.wait("@postRecommendation");
        cy.contains(name2);
        for(let i = 0; i<5; i++){
            cy.get("#upvote").click();
        }
        cy.get("#urlname").should("contain.text", name2);


        cy.get("#name").type(`${name3}`);
        cy.get("#youtubeLink").type(`${youtubeLink3}`);
        cy.intercept("POST", "http://localhost:4000/recommendations").as(
            "postRecommendation"
        );
        cy.get("#submit").click();
        //cy.wait("@postRecommendation");
        cy.contains(name3);
        cy.get("#upvote").click();
        cy.get("#urlname").should("contain.text", name3);

        cy.get("#top").click();
        cy.url().should("equal", "http://localhost:3000/top");

        cy.visit("http://localhost:3000");

        cy.get("#name").type(`${name4}`);
        cy.get("#youtubeLink").type(`${youtubeLink4}`);

        cy.intercept("POST", "http://localhost:4000/recommendations").as(
            "postRecommendation"
        );

        cy.get("#submit").click();
        //cy.wait("@postRecommendation");

        cy.contains(name4);
        for(let i = 0; i<15; i++){
            cy.get("#upvote").click();
        }

        cy.get("#top").click();
        cy.url().should("equal", "http://localhost:3000/top");

    })
})