import * as z from "zod";


export const Validate = (schema) => {
  return (req, res, next) => {
    try {
      // On réassigne : parse() applique les valeurs par défaut et la sanitisation.
      req.body = schema.parse(req.body);

      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
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
