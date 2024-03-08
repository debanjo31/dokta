import joi from "joi";

export const blogSchema = joi.object().keys({
  title: joi.string().required(),
  message: joi.string().required(),
});
export const blogUpdateSchema = joi.object().keys({
  title: joi.string(),
  message: joi.string(),
});

export const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
