import chalk from 'chalk';

export class InsufficientData extends Error {
  message = chalk.red('Unable to submit changes if there is are no changes 😄');
}

export class NotAuthorised extends Error {
  message = chalk.red('Target branch/repository does not exists on credentials are invalid');
}

export class Unknown extends Error {}
export class RequiredParameter extends Error {
  constructor(parameterName: string) {
    super(chalk.red(`Parameter [${parameterName}] is not stored/specified`));
  }
}
