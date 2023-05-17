export interface RequiredOps {
  username: string,
  password: string,
  repo: string,
}

export interface PayloadOps {
  branch: string,
  package: string,
  version: string,
  description: string,
  private: boolean,
  keywords: string,
  homepage: string,
  license: string,
  author: string,
}

export interface BehavioralOps {
  interactive: boolean,
  dryRun: boolean,
}

export interface Ops 
extends BehavioralOps, PayloadOps, Pick<RequiredOps, 'repo'> {
  creds: string;
}
