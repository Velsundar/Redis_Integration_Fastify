const fastifyPlugin = require("fastify-plugin");
const fastifyJwt = require("fastify-jwt");

async function jwtConnector(fastify, options) {
  fastify.register(fastifyJwt, { secret: "supersecret" });
}

module.exports = fastifyPlugin(jwtConnector);
