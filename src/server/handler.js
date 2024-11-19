const crypto = require("crypto");
const predict = require("../services/services.js");
const storeData = require("../services/storeData");
const { Firestore } = require("@google-cloud/firestore");

async function cancerPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
  const { label, suggestion } = await predict(model, image);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data,
  });
  response.code(201);
  return response;
}

async function getHistoriesHandler(request, h) {
  try {
    const db = new Firestore();
    const predictCollection = db.collection("prediction");

    const predictSnapshot = await predictCollection.get();

    if (predictSnapshot.empty) {
      return h
        .response({
          status: "success",
          data: [],
          message: "No history found.",
        })
        .code(200);
    }

    const data = [];
    predictSnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return h
      .response({
        status: "success",
        data: data,
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Failed to fetch history.",
        error: error.message,
      })
      .code(500);
  }
}
module.exports = { cancerPredictHandler, getHistoriesHandler };
