export interface Barque {
  id: string;
  name: string;
  port: string;
  owner: string;
  active: boolean;
  affiliation: string;
  immatriculation: string;
  nomBarque: string;
  portAttache: string;
}

export interface BarqueFilters {
  search: string;
  port: string;
  active?: boolean;
}
