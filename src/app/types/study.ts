import { components } from '../../types/clinicaltrials';

export type Study = components['schemas']['Study'] & {
  favorite: boolean;
};
