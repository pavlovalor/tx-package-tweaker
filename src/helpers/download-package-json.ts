import { exceptionsHandler } from './exceptions-handler';
import { withSpinner } from './with-spinner';
import { AxiosError } from 'axios';
import { agent } from '../data-agent';
import chalk from 'chalk';
import type { PackageJson } from 'type-fest';


export async function downloadPackageJson(repo: string): Promise<PackageJson> {
  const path = `${agent.defaults.baseURL}/repositories/${repo}/src/master/package.json`;

  const { data: json } = await withSpinner(`Fetching from ${path}`, agent
    .get<PackageJson>(path)
    .catch(exceptionsHandler({
      default: 'Something went wrong package.json fetching',
    })),
  );

  return json;
}
