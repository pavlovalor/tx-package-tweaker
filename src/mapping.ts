import type { PayloadOps } from './types';

const rules = new Map()
  .set('package', 'name')
  .set('branch', null)

/** Maps keys from commander.ops to propper package.json fields */
export const mapOps2PackageJsonFields = (ops: Partial<PayloadOps>) => {
  return Object.entries(ops).reduce((acc, [key, value]) => {
    const mapping = rules.get(key);

    if (mapping === null || !value) return acc;
    
    acc[mapping || key] = value;
    return acc;
  }, {} as Record<string,any>);
};
