import { prompts, NEXT_STEP, type Answer } from './prompts';

const transformerMap = {
  private: {
    for: (value: boolean) => value ? 'Private' : 'Public',
    from: (value: 'Private' | 'Public') => value === 'Private',
  },
}

export async function askPromptPayload(state: Record<string, unknown>) {
  while(true) {
    /** Ask which key in project.json to change */
    const { answer: topic }: Answer = await prompts.main();

    /** User choose to go next */
    if (topic === NEXT_STEP) return;

    /** Writing output */
    const transformers = (transformerMap as any)[topic];
    const initialValue: string = transformers
      ? transformers.for(state[topic])
      : state[topic];
    const { answer: value }: Answer = await prompts[topic](initialValue);
    state[topic] = transformers
      ? transformers.from(value)
      : value;
  }
}
