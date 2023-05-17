import inquirer from 'inquirer';
import chalk from 'chalk';
import { schemas, adapters } from './validation';


export const NEXT_STEP = chalk.yellow('Next step ->') as 'Next';
export interface Answer {
  answer: typeof NEXT_STEP | keyof typeof payloadPrompts;
}

const payloadPrompts = {
  package: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Enter desired package ~.name',
    default: initialValue,
  }),

  version: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Enter desired package ~.version',
    default: initialValue,
  }),

  description: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Enter desired package ~.description',
    default: initialValue,
  }),

  private: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'list',
    message: 'Should package be private',
    choices: ['Private', 'Public'],
    default: initialValue,
  }),
  
  keywords: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Enter desired keywords, add [+] in the beginning if you want to merge to existing',
    default: initialValue,
  }),
  
  homepage: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Enter desired package homepage',
    default: initialValue,
  }),
  
  license: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'list',
    message: 'Enter desired code license',
    choices: [
      'GNU (LPGL)',
      'The Apache License 2.0',
      'EULA',
      'GPL',
      'MIT',
    ],
    default: initialValue,
  }),
  
  author: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Enter desired package author',
    default: initialValue,
  }),

  branch: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Enter desired branch name under which PR should be pushed',
    default: initialValue,
  }),
}

export const prompts = {
  ...payloadPrompts,

  main: () => inquirer.prompt({
    name: 'answer',
    type: 'list',
    message: 'Which key would you like to change in package.json?',
    choices: Object.keys(payloadPrompts).concat(NEXT_STEP),
  }),

  username: () => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Enter your Bitbucket username:',
    validate: adapters.inquirer(schemas.username),
  }),

  password: () => inquirer.prompt({
    name: 'answer',
    type: 'password',
    message: 'Enter your Bitbucket password:',
    validate: adapters.inquirer(schemas.password),
  }),

  repo: () => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Enter your Bitbucket repository:',
    validate: adapters.inquirer(schemas.repo),
  }),

  title: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Edit/Confirm PR title:',
    default: initialValue,
  }),

  description: (initialValue?: string) => inquirer.prompt({
    name: 'answer',
    type: 'input',
    message: 'Edit/Confirm PR description:',
    default: initialValue,
  }),
};
