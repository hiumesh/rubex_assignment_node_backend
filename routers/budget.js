const express = require('express');

const router = express.Router();
const { createBudget, getUserBudgets, updateBudget, deposite } = require('../controllers/budget');
const { checkAuthentication } = require('../middlewares/auth');

router.get("/", checkAuthentication, getUserBudgets);
router.post("/", checkAuthentication, createBudget);
router.post("/:id", checkAuthentication, updateBudget);
router.post('/deposite/:id', checkAuthentication, deposite);

module.exports = router;
