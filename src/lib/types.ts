export interface Character {
  id: string;
  sex: string;
  jp_family: string;
  jp_given: string;
  name: string;
  points: number | string; // Sometimes "-" string in logic, but JSON has numbers or 0.
  status: string; // The "Alive/Dead" status (system tracking)
  note: string;
  purchasedSkills?: string[];
  currentSkills?: string[]; // Renamed from learnedSkills
  race?: string;
  age?: number;
  condition?: string; // e.g., "Healthy"
}

export interface Skill {
  name: string;
  cost: number;
  description: string;
  hidden_info?: string;
  has_levels?: boolean;
  growth_type?: string;
}

export interface Race {
  name: string;
  cost: number;
  description?: string;
  hidden_info?: string;
}

export interface GameData {
  roster: Character[];
  skills: Skill[];
  races: Race[];
}
