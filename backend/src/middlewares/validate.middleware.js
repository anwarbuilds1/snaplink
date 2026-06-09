const validatedRequestKeys = {
  body: "validatedData",
  params: "validatedParams",
  query: "validatedQuery",
};

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    req[validatedRequestKeys[source]] = result.data;

    next();
  };
};
