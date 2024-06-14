const fastifyPlugin = require("fastify-plugin");
const fastifyRedis = require("@fastify/redis");

async function redisConnector(fastify, options) {
  fastify.register(fastifyRedis, { url: "redis://localhost:6379", password: 12345 });
}

module.exports = fastifyPlugin(redisConnector);
