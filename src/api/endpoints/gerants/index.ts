import { gerantQueries } from './queries';
import { gerantMutations } from './mutations';

export const gerantApi = {
  ...gerantQueries,
  ...gerantMutations,
};
