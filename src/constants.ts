import querystring from 'node:querystring';


export const getPrDefaults = (input: {
  repositoryName: string,
  packageName: string,
  branchName: string,
}) => ({
  url: `/repositories/${input.repositoryName}/pullrequests`,
  body: {
    title: `Update ${input.packageName} package.json`,
    // TODO: make some fancy template here
    description: `Auto-generated pull request to update ${input.packageName}`,
    source: {
      branch: { name: input.branchName },
    },
    destination: {
      // TODO: We might want to push it somewhere else
      branch: { name: 'master' },
    },
  }
});

export const getCommitDefaults = (input: {
  repositoryName: string,
  branchName: string,
  fileContent: object,
}) => ({
  url: `/repositories/${input.repositoryName}/src`,
  body: querystring.stringify({
    branch: input.branchName,
    message: 'package.json update',
    '/package.json': JSON.stringify(input.fileContent, null, 2),
  }),
})
