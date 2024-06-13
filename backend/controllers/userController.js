const bcrypt = require("bcryptjs");
const constants = require("../config/constant");

const formatResponse = (message, status) => {
  return {
    message,
    status,
    timestamp: new Date().toISOString()
  };
};

const register = async (fastify, request, reply) => {
  const { username, password, email, phoneNumber } = request.body;

  const users = fastify.mongo.db.collection("users");
  const existingUser = await users.findOne({ $or: [{ phoneNumber }, { email }] });
  if (existingUser) {
    return reply
      .status(409)
      .send(
        formatResponse(constants.DUPLICATE_USER_MESSAGE, constants.STATUS_ERROR)
      );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await users.insertOne({
    username,
    password: hashedPassword,
    email,
    phoneNumber
  });
  reply.send(
    formatResponse(constants.REGISTER_SUCCESS_MESSAGE, constants.STATUS_SUCCESS),
  );
};

const login = async (fastify, request, reply) => {
  const { username, password } = request.body;

  const users = fastify.mongo.db.collection("users");
  const user = await users.findOne({ username });

  if (!user) {
    return reply
      .status(constants.STATUS_UNAUTHORIZED)
      .send(
        formatResponse(constants.USER_NOT_FOUND, constants.STATUS_UNAUTHORIZED)
      );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return reply
      .status(constants.STATUS_UNAUTHORIZED)
      .send(
        formatResponse(
          constants.INVALID_PASSWORD,
          constants.STATUS_UNAUTHORIZED
        )
      );
  }

  const token = fastify.jwt.sign({ username });
  await fastify.redis.set(`user:${username}:session`, JSON.stringify(user));

  reply.send({
    ...formatResponse(constants.SUCCESS, constants.STATUS_SUCCESS),
    token
  });
};

const logout = async (fastify, request, reply) => {
  const token = request.headers.authorization.split(" ")[1];
  const decoded = fastify.jwt.verify(token);

  await fastify.redis.del(`user:${decoded.username}:session`);

  reply.send(formatResponse(constants.SUCCESS, constants.STATUS_SUCCESS));
};

const updatePricing = async (fastify, request, reply) => {
  const { newPricing } = request.body;

  const pricing = fastify.mongo.db.collection("pricing");
  await pricing.updateOne(
    {},
    { $set: { price: newPricing } },
    { upsert: true }
  );

  await fastify.redis.flushall();

  reply.send(formatResponse(constants.SUCCESS, constants.STATUS_SUCCESS));
};

const getUser = async (fastify, request, reply) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const decoded = fastify.jwt.verify(token);

    let user = await fastify.redis.get(`user:${decoded.username}:session`);
    if (user) {
      console.log(`User data for ${decoded.username} fetched from Redis`);
      user = JSON.parse(user);
    } else {
      console.log(`User data for ${decoded.username} not found in Redis. Fetching from MongoDB.`);
      const users = fastify.mongo.db.collection("users");
      user = await users.findOne({ username: decoded.username });
      if (user) {
        await fastify.redis.set(`user:${decoded.username}:session`, JSON.stringify(user));
        console.log(`User data for ${decoded.username} stored in Redis`);
      } else {
        console.log(`User data for ${decoded.username} not found in MongoDB`);
      }
    }
    reply.send({
      ...formatResponse(constants.SUCCESS, constants.STATUS_SUCCESS),
      user
    });
  } catch (err) {
    reply
      .status(constants.STATUS_UNAUTHORIZED)
      .send(
        formatResponse(constants.UNAUTHORIZED, constants.STATUS_UNAUTHORIZED)
      );
  }
};

module.exports = {
  register,
  login,
  logout,
  updatePricing,
  getUser
};
