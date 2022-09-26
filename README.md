English:

Sing me a song is an application for anonymous song recommendation. The more people like a recommendation, the more likely it is to be recommended to others 🙂

This repository is split between front-end and back-end.

To run the React application you should open the terminal on the front-end folder, and run: 

`npm i` to install the needed node modules;

`npm run build` to build the react app;

`npm run start` to open the application front end ( you need the api running for it to work );

To run the back-end api you should open the terminal on the back-end folder, and run: 

`npm i` to install the needed node modules;

`npm run dev` to run the api in dev mode ( dev, as this is not an final deploy method );

API Endpoints:

- **TESTS `unitary`**

    Run the command 'npm run test unit' inside the *back-end* folder

- **TESTS `integration`**

    Run the command 'npm run test integration' inside the *back-end* folder
   
- **TESTS `End to End (E2E)`**

    Run the command 'npx cypress open' inside the *front-end* folder. For this test to work correctly, it is necessary to be running the back-end on port 4000, with the command 'npm run dev', and the front-end with the ' npm run start' on port 3000

- **POST `/recommendations`**
    
    Adds a new song recommendation. The request has the following format:
    
    ```json
    {
    "name": "Falamansa - Xote dos Milagres",
    "youtubeLink": "[https://www.youtube.com/watch?v=chwyjJbcs1Y](https://www.youtube.com/watch?v=chwyjJbcs1Y&ab_channel=Deck)"
    }
    ```
    
    - Validation
        - `name` is a mandatory string
        - `youtubeLink` must be a youtube link
- **POST `/recommendations/:id/upvote`**
    
    Adds one point to the recommendation score. It does not expect anything in the body.
    
- **POST `/recommendations/:id/downvote`**
    - Removes one point from the recommendation score. It does not expect anything in the body.
    - If the score falls below -5, the recommendation must be deleted.


- **GET `/recommendations`**
    
    Get the last 10 recommendations.
    
    The response has the format:
    
    ```jsx
    [
    {
    "id": 1,
    "name": "Chitãozinho E Xororó - Evidences",
    "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    "score": 245
    }
    ]
    ```

- **GET `/recommendations/:id`**
    
    Get a recommendation by your ID.
    
    The response has the format:
    
    ```jsx
    {
    "id": 1,
    "name": "Chitãozinho E Xororó - Evidences",
    "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    "score": 245
    },
    ```
    
- **GET `/recommendations/random`**
    
    Takes a random recommendation, based on the following logic:
    
    - **70% of the times they hit this route**: a song with a score greater than 10 should be randomly recommended
    - **30% of the times they hit this route**: a song with a score between -5 and 10 (inclusive), should be randomly recommended
    - If there are only songs with a score above 10 or only below/equal to 10, 100% of the time any song must be drawn
    - If there is no song registered, status 404 must be returned
    
    The response has the format:
    
    ```jsx
    {
    "id": 1,
    "name": "Chitãozinho E Xororó - Evidences",
    "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    "score": 245
    },
    ```
    
- **GET `/recommendations/top/:amount`**
    
    Lists the songs with the most points and their score. Top x songs are returned (parameter `:amount` of the route), ordered by score (highest first)
    
    ```json
    [
    {
    "id": 150,
    "name": "Chitãozinho E Xororó - Evidences",
    "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    "score": 245
    },
    {
    "id": 12,
    "name": "Falamansa - Xote dos Milagres",
    "youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    "score": 112
    },
    ]
    ```

Portuguese:

Sing me a song é um aplicativo para recomendação de músicas anônimas. Quanto mais pessoas gostarem de uma recomendação, maior a probabilidade de ser recomendado para outras pessoas 🙂

Este repositório é dividido entre front-end e back-end.

Para executar o aplicativo React, você deve abrir o terminal na pasta front-end e executar:

`npm i` para instalar os módulos de nó necessários;

`npm run build` para construir o aplicativo react;

`npm run start` para abrir o front end do aplicativo (você precisa da api em execução para que funcione);

Para executar a API de back-end, você deve abrir o terminal na pasta de back-end e executar:

`npm i` para instalar os módulos de nó necessários;

`npm run dev` para executar a API no modo dev (dev, pois este não é um método de deploy final);

A API possui as seguintes rotas:

- **POST `/recommendations`**
    
    Adiciona uma nova recomendação de música. A requisição tem o seguinte formato:
    
    ```json
    {
    	"name": "Falamansa - Xote dos Milagres",
    	"youtubeLink": "[https://www.youtube.com/watch?v=chwyjJbcs1Y](https://www.youtube.com/watch?v=chwyjJbcs1Y&ab_channel=Deck)"
    }
    ```
    
    - Validação
        - `name` é uma string obrigatória
        - `youtubeLink` deve ser um link do youtube

- **POST `/recommendations/:id/upvote`**
    
    Adiciona um ponto à pontuação da recomendação. Não espera nada no corpo.
    
- **POST `/recommendations/:id/downvote`**
    - Remove um ponto da pontuação da recomendação. Não espera nada no corpo.
    - Se a pontuação fica abaixo de -5, a recomendação deve ser excluída.
    
- **GET `/recommendations`**
    
    Pega todas as últimas 10 recomendações.
    
    A resposta tem o formato:
    
    ```jsx
    [
    	{
    		"id": 1,
    		"name": "Chitãozinho E Xororó - Evidências",
    		"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    		"score": 245
    	}
    ]
    ```
    
- **GET `/recommendations/:id`**
    
    Pega uma recomendação pelo seu ID.
    
    A resposta tem o formato:
    
    ```jsx
    {
    	"id": 1,
    	"name": "Chitãozinho E Xororó - Evidências",
    	"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    	"score": 245
    },
    ```
    
- **GET `/recommendations/random`**
    
    Pega uma recomendação aleatória, baseada na seguinte lógica:
    
    - **70% das vezes que baterem nessa rota**: uma música com pontuação maior que 10 deve ser recomendada aleatoriamente
    - **30% das vezes que baterem nessa rota**: uma música com pontuação entre -5 e 10 (inclusive), deve ser recomendada aleatoriamente
    - Caso só haja músicas com pontuação acima de 10 ou somente abaixo/igual a 10, 100% das vezes deve ser sorteada qualquer música
    - Caso não haja nenhuma música cadastrada, deve ser retornado status 404
    
    A resposta tem o formato:
    
    ```jsx
    {
    	"id": 1,
    	"name": "Chitãozinho E Xororó - Evidências",
    	"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    	"score": 245
    },
    ```
    
- **GET `/recommendations/top/:amount`**
    
    Lista as músicas com maior número de pontos e sua pontuação. São retornadas as top x músicas (parâmetro `:amount` da rota), ordenadas por pontuação (maiores primeiro)
    
    ```json
    [
    	{
    		"id": 150,
    		"name": "Chitãozinho E Xororó - Evidências",
    		"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    		"score": 245
    	},
    	{
    		"id": 12,
    		"name": "Falamansa - Xote dos Milagres",
    		"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    		"score": 112
    	},
    	...
    ]
    ```
    
- **TESTES   `unitarios`**

    Execute o comando 'npm run test unit' dentro da pasta *back-end*

- **TESTES   `integração`**

    Execute o comando 'npm run test integration' dentro da pasta *back-end*
   
- **TESTES   `End to End (E2E)`**

    Execute o comando 'npx cypress open' dentro da pasta *front-end* para que este teste funcione corretamente, é necessário estar rodando o back end na porta 4000, com o comando 'npm run dev', e o front end com o 'npm run start' na porta 3000
