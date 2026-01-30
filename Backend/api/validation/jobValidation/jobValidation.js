const Joi = require("joi");

export const jobSchema = Joi.object({
  source: Joi.string().required(),
  externalJobId: Joi.string().required(),
  title: Joi.string().allow(""),
  company: Joi.string().allow(""),
  description: Joi.string().allow(""),
  applyUrl: Joi.string().uri().allow("")
});
