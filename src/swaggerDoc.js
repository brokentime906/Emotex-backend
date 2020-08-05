const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  //swagger문서 설정
  swaggerDefinition: {
    info: {
      title: "서버 API 설계",
      version: "1.0.0",
      description: "서버 API with express",
    },
    host: "localhost:4000",
    basePath: "/",
  },
  //swagger api가 존재하는 곳 입니다.
  apis: ["./src/apidocs/*.js"],
};

const specs = swaggereJsdoc(options);

module.exports = (app) => {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));
};
