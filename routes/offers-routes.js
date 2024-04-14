const express = require("express");
const route = express.Router();
const db = require("../models");




route.get("/ok/offers", async (req, res) => {

  try {
    const alloffers = await db.Completed_offers.findAll();
    res.status(200).json(alloffers);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});


route.get("/ok/offers/:UserId", async (req, res) => {
  try {
    const getOfferByUserId = await db.Completed_offers.findOne(
      { where: { UserId: req.params.UserId } },
      { include: { model: db.Completed_offers, required: true } }
    );
    res.status(200).json(getOfferByUserId);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});


route.get("/ok/offerid/:id", async (req, res) => {
  try {
    const getOfferById = await db.Completed_offers.findOne({
      where: { id: req.params.id },
      include: [{ model: db.User, required: true }],
    });
    res.status(200).json(getOfferById);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});



module.exports = route;
