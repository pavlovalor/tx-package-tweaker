#!/usr/bin/env node

import { LocalStorage } from 'node-localstorage';
import { program } from 'commander';
import chalk from 'chalk';

import { mapOps2PackageJsonFields } from './mapping';
import { schemas, adapters } from './validation';
import { askPromptPayload } from './payload-capture';
import { prompts } from './prompts';
import { agent } from './data-agent';
import * as Exceptions from './exceptions';
import * as constants from './constants';
import * as helpers from './helpers';
import type { Ops } from './types'

const credentials = new LocalStorage('./dist');

/** 
 * Definition of available options 
 * and commands
 */
program
  .option(
    '-c, --creds <creds>', 
    'Auth information in format "<username>:<password>"',
    /** validate */
    adapters.commander(schemas.creds),
  )
  .option(
    '-r, --repo <repositoryName>', 
    'Bitbucket repository name',
    adapters.commander(schemas.repo),
  )
  .option(
    '-b, --branch <branchName>',
    'Defines a branch for PR',
  )
  .option(
    '--package <packageName>', 
    'Package name'
  )
  .option(
    '--version <version>',
    'Package version'
  )
  .option(
    '--description <description>',
    'Package description'
  )
  .option(
    '--private',
    'Is package allowed for publishing'
  )
  .option(
    '--keywords <keywords>',
    'Package keywords',
  )
  .option(
    '--homepage <homepage>',
    'Package homepage',
  )
  .option(
    '--license <license>',
    'Repository license',
  )
  .option(
    '--author <author>',
    'Package author in format <fullname>, <email>, <homepage>',
  )
  .option(
    '--interactive',
    'In interactive you will be able to prompt actions you might want to perform',
  )
  .option(
    '--dry-run',
    'Shows what would be changed in the target package.json file',
  )
  .parse(process.argv);


~ async function main() {
  console.log('🚀 Package.json tweaker\n');

  const { interactive, dryRun, repo, creds, ...opsPayload } = program.opts<Partial<Ops>>();
  const [ username, password ] = (creds ?? '').split(':');
  let payload = {
    branch: 'package-json-update_' + Date.now(),
    ...opsPayload,
  };

  console.log('🥊 Checking if conditions are met \n');

  // Step1: Check required options
  const requiredOptions = {
    username: username || credentials.getItem('username')?.trim(),
    password: password || credentials.getItem('password')?.trim(),
    repo: repo,
  };

  // Step1.1: Ask for missing options if in interactive mode
  let optionKey: keyof typeof requiredOptions;
  for (optionKey in requiredOptions) {
    if (interactive) 
      requiredOptions[optionKey] ??= (await prompts[optionKey]()).answer;
    else if (!requiredOptions[optionKey])
      throw new Exceptions.RequiredParameter(optionKey);
  }

  console.log('🤫 Refreshing credentials \n');

  // Step1.2: Save creds data
  credentials.setItem('username', requiredOptions.username!);
  credentials.setItem('password', requiredOptions.password!);
  agent.defaults.auth = {
    username: requiredOptions.username!,
    password: requiredOptions.password!,
  };

  // Step2.1: Ask for clarifications in case of interactive mode
  if (interactive) await askPromptPayload(payload);
  
  // Step3: Get current package.json
  const packageJson = await helpers.downloadPackageJson(requiredOptions.repo!);

  // Step3.1: Validate what we have
  if (Object.keys(payload).length === 1)
    throw new Exceptions.InsufficientData;

  // Step3.1: Reveal prepared changes
  console.log('\n🚧 Changes applied:');
  const packageJsonFields = mapOps2PackageJsonFields(payload);

  helpers.renderBlock('-', Object.entries(packageJsonFields).reduce((acc, [key, value]) => {
    const isDifferent = key in packageJson && packageJson[key] !== value;
    if (isDifferent)
      acc.push(chalk.red(`[-] ${key}: ${helpers.decorate(packageJson[key])}`));
    acc.push(chalk.green(`[+] ${key}: ${helpers.decorate(value)}`));
    return acc;
  }, [] as string[]));

  // TODO: perhaps it would be good to add PR changes as well
  if (dryRun) return;

  // Step4: Prepare commit and open PR
  const prData = constants.getPrDefaults({
    repositoryName: requiredOptions.repo!,
    packageName: payload.package!,
    branchName: payload.branch,
  });

  console.log(`\n⚡️ Preparing PR data\n`);

  // Step4.1: Confirming PR details
  if (interactive) {
    ({ answer: prData.body.title } = await prompts.title(prData.body.title));
    ({ answer: prData.body.description } = await prompts.description(prData.body.description));
  }

  const commitData = constants.getCommitDefaults({
    repositoryName: requiredOptions.repo!,
    fileContent: { ...packageJson, ...packageJsonFields },
    branchName: payload.branch,
  });

  await helpers.withSpinner(`Comitting to ${agent.defaults.baseURL + commitData.url}`, agent
    .post(commitData.url, commitData.body)
    .catch(helpers.exceptionsHandler({
      default: 'Unable to peform commit',
    })),
  );

  const { data: pr } = await helpers.withSpinner('Creating Pull Request', agent
    .post(prData.url, prData.body)
    .catch(helpers.exceptionsHandler({
      default: 'Unable to perform PR creation',
    })),
  );

  // Step5: Show that we rock 🤘
  helpers.renderBlock('=', [
    'New PullRequest and a branch have been successfully created 🤘',
    'Use links below to navigate to fresh urls',
    '',
    `    PR url: https://bitbucket.org/${requiredOptions.repo}/pull-requests/${pr.id}`,
    `Branch url: https://bitbucket.org/${requiredOptions.repo}/src/${payload.branch}/`,
  ]);  
}();
