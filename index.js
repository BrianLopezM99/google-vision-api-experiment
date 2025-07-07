const express = require("express");
const bodyParser = require("body-parser");
const vision = require("@google-cloud/vision");
const app = express();
const port = 3000;

// Cliente autenticado con JSON de Google Vision API
const client = new vision.ImageAnnotatorClient({
  keyFilename: "./cloudvisionapi.json",
});

app.use(bodyParser.json({ limit: "30mb" }));

app.post("/analyze", async (req, res) => {
  console.log("Received request, processing...");

  try {
    const { requests } = req.body;

    if (!requests || !requests[0]?.image?.content) {
      console.log("Invalid request format");
      return res.status(400).json({ error: "Invalid request format" });
    }

    console.log("Processing request...");

    const [result] = await client.batchAnnotateImages(req.body);

    const labels =
      result.responses?.[0]?.labelAnnotations?.map((l) => l.description) || [];

    console.log("Tipo de requests:", typeof requests);
    console.log("Es array?", Array.isArray(requests));
    console.log("Contenido first request:", requests[0]);
    console.log("Contenido labels:", labels);
    console.log("Contenido result:", result);

    res.json({ labels });
  } catch (err) {
    console.error("Google Vision error:", err);
    res.status(500).json({ error: "Error al analizar imagen" });
  }
});



app.listen(port, () => {
  console.log(`Servidor VisionAPI corriendo en http://localhost:${port}`);
});
