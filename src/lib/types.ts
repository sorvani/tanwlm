export interface Character {
  id: string;
  sex: string;
  jp_family: string;
  jp_given: string;
  name: string;
  points: number | string; // Sometimes "-" string in logic, but JSON has numbers or 0.
  status: string;
  note: string;
  purchasedSkills?: string[];
  learnedSkills?: string[];
}

export interface Skill {
  name: string;
  cost: number;
  description: string;
  hidden_info?: string;
}

export interface Race {
  name: string;
  cost: number;
  description?: string;
}

export interface GameData {
  roster: Character[];
  skills: Skill[];
  races: Race[];
}
