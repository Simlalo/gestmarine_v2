import { barqueQueries } from './queries';
import { barqueMutations } from './mutations';

export const barqueApi = {
  ...barqueQueries,
  ...barqueMutations,
};
