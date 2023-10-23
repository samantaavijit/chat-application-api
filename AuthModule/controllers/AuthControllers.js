const { commonMessage, response } = require("../../common/responseHelper");
const { validationResult } = require("express-validator");
const UsersModel = require("../models/UsersModel");
const { signupMessage } = require("./AuthResponse");
const bcrypt = require("bcrypt");

let responseData;

const registration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      responseData = {
        success: false,
        message: commonMessage.COMPLETE_MANDATORY_FIELD,
        errors: errors.array(),
      };
      return response({
        statusCode: 200,
        status: "failed",
        response: responseData,
        res,
      });
    }

    let { email, password } = req.body;

    // CHECK email ALREADY EXIST OR NOT

    const isPresent = await UsersModel.findOne({ email });

    if (isPresent) {
      responseData = {
        success: false,
        message: signupMessage.EMAIL_EXIST,
      };
      return response({
        statusCode: 200,
        status: "failed",
        response: responseData,
        res,
      });
    }

    const solt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, solt);

    const user = await UsersModel.create({ email, password });

    if (user) {
      responseData = {
        success: true,
        message: signupMessage.SUCCESS,
      };
      return response({
        statusCode: 200,
        status: "success",
        response: responseData,
        res,
      });
    }
    responseData = {
      success: false,
      message: signupMessage.FAILED,
    };
    return response({
      statusCode: 200,
      status: "failed",
      response: responseData,
      res,
    });
  } catch (err) {
    let responseData = {
      success: false,
      message: commonMessage.API_ERROR,
      err: err.stack,
    };
    return response({
      statusCode: 200,
      status: "failed",
      response: responseData,
      res,
    });
  }
};

module.exports = {
  registration,
};
