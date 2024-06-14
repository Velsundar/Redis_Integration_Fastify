const path = require("path");
const fastify = require("fastify")({ logger: true });
// const fastifySwagger = require("fastify-swagger");
const autoload = require("@fastify/autoload");
const fastifySwagger = require ('@fastify/swagger');
const fastifySwaggerUi = require('@fastify/swagger-ui');

fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Redis Integrated API',
        description: 'Redis Integartion Example API Documentation',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer'
          }
        }
      },
      tags: [
        {
          name: 'Root',
          description: 'Root endpoints'
        }
      ]
    }
  });
  
  fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) {
        next();
      },
      preHandler: function (_request, _reply, next) {
        next();
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true
  });
  
fastify.register(autoload, {
  dir: path.join(__dirname, "plugins")
});

fastify.register(autoload, {
  dir: path.join(__dirname, "routes")
});

fastify.ready(async () => {
  try {
    await fastify.redis.ping();
    console.log('Redis connection established');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
    process.exit(1);
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 4000, host: "0.0.0.0" });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
