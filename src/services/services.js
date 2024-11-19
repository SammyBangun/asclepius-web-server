const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/inputErr");

async function predict(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const classes = ["Cancer", "Non-cancer"];

    const prediction = model.predict(tensor);

    const classResult = (await prediction.data())[0];
    const label = classes[classResult > 0.5 ? 0 : 1];

    const suggestion =
      label === "Cancer"
        ? "Segera periksa ke dokter!"
        : "Penyakit kanker tidak terdeteksi.";

    return { label, suggestion };
  } catch (error) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}

module.exports = predict;
