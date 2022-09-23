import { faker } from "@faker-js/faker"

export async function CreateRecommendation(){

    return{
        name: faker.lorem.words(),
        youtubeLink: "https://www.youtube.com/watch?v=17ozSeGw-fY"
    }

}