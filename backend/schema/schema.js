const registerSchema = {
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string" },
      password: { type: "string" }
    }
  }
};
const userSchema = {
  type: "object",
  required: ["username", "password", "email", "phoneNumber"],
  properties: {
    username: { type: "string" },
    password: { type: "string" },
    email: { type: "string", format: "email" },
    phoneNumber: { type: "string" }
  }
};
const registerResponseSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
      status: { type: "string" },
      timestamp: { type: "string", format: "date-time" }
    }
  },
  409: {
    type: "object",
    properties: {
      message: { type: "string" },
      status: { type: "string" },
      timestamp: { type: "string", format: "date-time" }
    }
  }
};

const loginSchema = {
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string" },
      password: { type: "string" }
    }
  }
};

const updatePricingSchema = {
  body: {
    type: "object",
    required: ["newPricing"],
    properties: {
      newPricing: { type: "number" }
    }
  }
};

module.exports = { registerSchema, loginSchema, updatePricingSchema, userSchema, registerResponseSchema };
