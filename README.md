
# Virtual Kitty
This project enables you to run or deploy your own ChatGPT like application.

## Run Locally

Clone the repository
```sh
git clone https://github.com/Jhony14/virtual-kitty.git
```

Create a .env file within the new directory
```sh
cd virtual-kitty && touch .env
echo OPENAI_API_KEY=<YOUR_API_KEY_HERE> >> .env
```

Install dependencies & start the dev server
```sh
npm i && node server.js
```

You can now access the dev server running at [localhost:3000](https://localhost:3000)