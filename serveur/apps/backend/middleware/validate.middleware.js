import * as z from "zod";


export const Validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);

      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err.issues);
        const errors = err?.issues?.map((error) => ({
          field: error.path[0],
          message: error.message,
        }));
        return res.status(400).json({ errors });
      }
      
      next(err);
    }
  };
};
