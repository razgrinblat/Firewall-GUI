//routes/clientsRoutes/js
const express = require("express");
const router = express.Router();
const { getAllClients } = require("../store/clientsStore");

router.get("/clients", (req, res) => {
  res.json(getAllClients());
});

module.exports = router;
