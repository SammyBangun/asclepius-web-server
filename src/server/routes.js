const { cancerPredictHandler, getHistoriesHandler } = require("./handler");

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: cancerPredictHandler,
    options: {
      payload: {
        maxBytes: 1000000,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    path: "/predict/histories",
    method: "GET",
    handler: getHistoriesHandler,
  },
];

module.exports = routes;
