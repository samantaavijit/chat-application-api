const { registration } = require("../controllers/AuthControllers");
const { signupValidation } = require("../validation/AuthValidation");

const AuthRouter = require("express").Router();

AuthRouter.post("/register", [signupValidation], registration);

module.exports = AuthRouter;
