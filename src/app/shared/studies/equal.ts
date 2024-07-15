import { components } from '../../../types/clinicaltrials';

export const studyEqual = (
  s1: components['schemas']['Study'],
  s2: components['schemas']['Study']
) =>
  s1.protocolSection?.identificationModule?.nctId ===
  s2.protocolSection?.identificationModule?.nctId;
