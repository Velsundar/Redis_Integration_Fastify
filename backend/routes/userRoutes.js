const userController = require("../controllers/userController");
const {
  registerSchema,
  loginSchema,
  updatePricingSchema
} = require("../schema/schema");
const { userSchema, registerResponseSchema } = require('../schema/schema')

async function routes(fastify, options) {
  fastify.post(
    "/register",
    {
      body: userSchema,
      response: registerResponseSchema,
      config: { description: "Register a new user", tags: ["User"] }
    },
    (request, reply) => userController.register(fastify, request, reply)
  );
  fastify.post(
    "/login",
    {
      schema: loginSchema,
      config: { description: "Log in a user", tags: ["User"] }
    },
    (request, reply) => userController.login(fastify, request, reply)
  );
  fastify.post(
    "/logout",
    { config: { description: "Log out a user", tags: ["User"] } },
    (request, reply) => userController.logout(fastify, request, reply)
  );
  fastify.post(
    "/update-pricing",
    {
      schema: updatePricingSchema,
      config: { description: "Update pricing", tags: ["Pricing"] }
    },
    (request, reply) => userController.updatePricing(fastify, request, reply)
  );
  fastify.get(
    "/getUser",
    { config: { description: "Get current user", tags: ["User"] } },
    (request, reply) => userController.getUser(fastify, request, reply)
  );
}

module.exports = routes;
