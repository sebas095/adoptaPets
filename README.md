![AdoptaPets](public/img/title.png)

This is an application made in the Entrepreneurship course for the adoption of pets

## Requeriments/dependencies
* [NodeJS](https://nodejs.org/en/)
* [Mongodb](https://docs.mongodb.com/manual/installation/)

### Design/Web Style

* [Materialize](http://materializecss.com/)

## Installation
```bash
npm install or yarn install
```

## Run
```bash
npm start or yarn start
```
## Run Docker container
### Mongo db
```bash
docker run -d --restart always --name mongoAdoptaPets mongo
```

### App
```bash
docker run --link=mongoAdoptaPets:mongodb --name adoptaPets -d --restart always -p 9999:3000 -v /home/ubuntu/adoptaPets/uploads:/home/adoptaPets/public/uploads labsirius/adopta-pets ./run.sh
```