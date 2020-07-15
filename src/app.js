const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//DB 연동 , mongoDB 사용
const connect = require("./schemas");
connect();

//middle ware
app.use(cors()); //
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes 설정
const routes = require("./routes");
app.use("/", routes);

const swaggerDoc = require("./swaggerDoc");
swaggerDoc(app);

//server starts
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`${PORT} port , start server`));
