### Package tweaker ![npm](https://img.shields.io/npm/v/@pavlovalor/tx-package-tweaker?color=gree&label=NPM%20package)
Creates PR with updated `package.json` according to specified options/prompts.

<img src=".github/media/demo.gif"/>

> Sorry. It's late already, so please forgive me doc sparsity 🫥
> PS: It seems that conversion to GIF made it so slow, it looks like I type like grandma

# Installation
To install & use tool type:
````bash
npm install -g @pavlovalor/tx-package-tweaker && \
tweakp --interactive
# or
yarn add --global @pavlovalor/tx-package-tweaker && \
tweakp --interactive
````

Or your can keep it safe and just clone this repo, install deps, and run dev script:
````bash
git clone git@github.com:pavlovalor/tx-package-tweaker.git && \
cd tx-package-tweaker && \
yarn && \
yarn start:dev --interactive
````

# Usage
- Supports interactive mode, use `--interactive`.
  You'll be ask of any required unspecified variable + fields to change.
- To get list of all available fields use `--help`.
- Dry run via `--dry-run` will only show potential changes.
- CI creds + repo data injection via `-r <workspace>/<repo>` and `-c <username>:<password>`;

> PS: creds are going to be stored, so there is no need to specify it twice;  
