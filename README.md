# CIT412_OpenMarketplace
Final Group Project for CIT 412 - Open Marketplace (Similar to Facebook Marketplace)
> Note: Commit History is a little wrong as we had to do a recovery through a force push as well as a rebase of a branch to be able to merge it to main

# Project Setup


## Select the Project
```bash
gcloud config set project cit412-final-project-494116
```

## Backend Config
```bash
cd backend
npm install
cp .env.example .env    # edit env values with same maps api key
npm run dev             # or npm start
```

## Frontend Config
```bash
cd frontend
npm install
cp .env.example .env    # edit env values with same maps api key
npm start
```
