const fastifyPlugin = require("fastify-plugin");
const fastifyMongo = require("fastify-mongodb");

async function mongoConnector(fastify, options) {
  fastify.register(fastifyMongo, { url: "mongodb://localhost:27017/admin" });
}

module.exports = fastifyPlugin(mongoConnector);