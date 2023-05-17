import { InvalidArgumentError } from 'commander';
import { z, type ZodSchema } from 'zod';


export const schemas = {
  password: z.string().min(8),
  username: z.string().min(8).regex(
    // /^[A-Za-z0-9_.-]+$/,
    /^.+$/,
    'Could not contain special chars'
  ),
  repo: z.string().regex(
    /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, 
    'Should match pattern <organisation/user>/<repository-name'
  ),
  creds: z.string().regex(
    /^[A-Za-z0-9_.-]+:.{8,}$/,
    'Should match pattern <username>:<password>'
  ),
}

export const adapters = {
  inquirer: (schema: ZodSchema) => (value: unknown) => {
    const output = schema.safeParse(value);
    return output.success || output.error.message;
  },

  commander: (schema: ZodSchema) => (value: unknown) => {
    const output = schema.safeParse(value);
    if (output.success) return output.data;
    throw new InvalidArgumentError(output.error.message);
  }
}
