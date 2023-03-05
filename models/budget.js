const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');

const BudgetSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Decimal128,
    required: true,
    min: 0,
  },
  backgroundImageURL : {
    type: String,
    required: true,
    default: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWJzdHJhY3R8ZW58MHx8MHx8&w=1000&q=80",
  },
  depositedAmount: {
    type: Decimal128,
    required: true,
    default: 0,
    min: 0,
  },
  duration: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const regex = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

        return regex.test(value);
      },
      message: (props) => `${props.value} is not a valid ISO duration format!`,
    },
  },
  depositeInterval: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return ['DAILY', 'MONTHLY', 'WEEKELY'].includes(v);
      },
      message: props => `${props.value} is not a valid Deposite Interval color!`
    }
  },
  status: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return ['ACTIVE', 'COMPLETED'].includes(v);
      },
      message: props => `${props.value} is not a valid status!`
    },
    default: "ACTIVE",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);