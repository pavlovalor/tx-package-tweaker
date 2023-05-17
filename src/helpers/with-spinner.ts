import { Spinner } from 'cli-spinner';
import chalk from 'chalk';

/** Wraps any promise with cli spinner */
export async function withSpinner<T extends any, P extends Promise<T>>(
  message: string, 
  promise: P
): Promise<Awaited<P>> {
  const spinner = new Spinner({
    text: message,
  });

  spinner.start();
  const result = await promise;
  spinner.stop();
  console.log('...', chalk.green.bold('Done'));

  return result;
}
