const mongoose = require('mongoose');

const Budget = require("../models/budget");
const {
  BUDGET_ID_AND_AMOUNT_NOT_PROVIDED,
  BUDGET_NOT_FOUND,
  NOT_TRUE_OWNER,
  BUDGET_ID_NOT_PROVIDED,
} = require("../error");

const { Decimal128 } = mongoose.Types;

exports.getUserBudgets = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { owner: req.user._id };

    if (status) {
      query = { ...query, status };
    }
    const budgets = await Budget.find(query).exec();

    res.status(200).json({
      type: "success",
      message: "User's Budgets",
      data: {
        budgets,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createBudget = async (req, res, next) => {
  try {
    const budget = new Budget({
      ...req.body,
      owner: req.user._id,
    });

    const newBudget = await budget.save();

    res.status(200).json({
      type: "success",
      message: "New Budget created",
      data: {
        budget: newBudget,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budgetId = req.params.id;

    if (!budgetId) {
      next({ status: 400, message: BUDGET_ID_NOT_PROVIDED });
      return;
    }

    let budget = await Budget.findById(budgetId).exec();

    if (!budget) {
      next({ status: 400, message: BUDGET_NOT_FOUND });
      return;
    }
  
    if (!budget.owner.equals(req.user._id)) {
      next({ status: 400, message: NOT_TRUE_OWNER });
      return;
    }

    budget = await Budget.updateOne({ _id: budgetId }, { ...req.body }).exec();

    res.status(200).json({
      type: "success",
      message: "Budget Updated",
      data: {
        budget: budget,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deposite = async (req, res, next) => {
  try {
    const budgetId = req.params.id;

    const { amount } = req.body;

    if (!budgetId || !amount) {
      next({ status: 400, message: BUDGET_ID_AND_AMOUNT_NOT_PROVIDED });
      return;
    }

    let budget = await Budget.findById(budgetId).exec();

    if (!budget) {
      next({ status: 400, message: BUDGET_NOT_FOUND });
      return;
    }

  
    if (!budget.owner.equals(req.user._id)) {
      next({ status: 400, message: NOT_TRUE_OWNER });
      return;
    }

    budget = await Budget.findByIdAndUpdate(budgetId, { $inc : { depositedAmount: amount }}, { setOptions: { decimal128: true }, new: true }).exec();

    if (budget.depositedAmount > budget.amount) {
      budget = await Budget.findByIdAndUpdate(budgetId, { status: 'COMPLETED' }, { new: true }).exec();
    }

    res.status(200).json({
      type: "success",
      message: "Amount Added",
      data: {
        budget: budget,
      },
    });
  } catch (error) {
    next(error);
  }
};
