export interface Boat {
  id: string;
  affiliation: string;      // Affiliation
  immatriculation: string;  // Immatriculation (10/1-5256 format)
  nomBarque: string;        // Nom de barque
  portAttache: string;      // Port d'attache
  gerantId?: string;       // ID of the assigned gérant
  gerantName?: string;     // Name of the assigned gérant
  isActive?: boolean;      // Whether the boat is active or not, defaults to true
}
