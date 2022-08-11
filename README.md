# FoodBear API

Code coverage: 93.68%

## ERD
<a href="docs/erd.jpg"><img src="docs/erd.jpg" width="350"></a>

## Development
1. Install all packages using npm/pnpm/yarn.
```
npm install
```
2. Run all the services (postgresql, meilisearch, redis) using docker or if you have install directly on your machine then make sure all of the services are running.

```
docker compose up -d
```
3. Setup your env file by copying the .env-sample to .env. Don't ever **delete** or **rename** the .env-sample. Create new file! Fill in all the relevant details.
4. Run the app.
```
npm run dev
# or
npm run dev:watch #auto reload
```

> We will not be running the app on docker due to poor performance when reloading/restarting app in Windows. If you want to run it through docker, then just uncomment the app section in the docker-compose.yml. 
    
## API Route Documentation

### Summary
> You can view the full api documentations on Postman or the openapi schema file in the docs folder.
| No | Route               | Method | Query                | Param | Body             |
|----|---------------------|--------|----------------------|-------|------------------|
| 1  | /                   | GET    |                      |       |                  |
| 2  | /restaurants        | GET    | open, limit          |       |                  |
| 3  | /restaurants/top    | GET    | min_price, max_price |       |                  |
| 4  | /restaurants/search | GET    | q                    |       |                  |
| 5  | /purchases          | POST   |                      |       | menu_id, user_id |
| 6  | /users/:id          | GET    |                      | id    |                  |

### Postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/1198381-e0614068-ecc2-4fa3-92d6-4397a37e1112?action=collection%2Ffork&collection-url=entityId%3D1198381-e0614068-ecc2-4fa3-92d6-4397a37e1112%26entityType%3Dcollection%26workspaceId%3D13a222dc-25e7-4b4c-8cbc-d13a44e13a15)
