export type PokemonType =
  | 'fire'
  | 'normal'
  | 'fighting'
  | 'water'
  | 'flying'
  | 'grass'
  | 'poison'
  | 'electric'
  | 'ground'
  | 'psychic'
  | 'rock'
  | 'ice'
  | 'bug'
  | 'dragon'
  | 'ghost'
  | 'dark'
  | 'steel'
  | 'fairy';

export interface Pokemon {
  id: number;
  name: string;
  weight: string;
  height: string;
  stats: { baseStat: number; name: string }[];
  types: { slot: number; type: PokemonType }[];
  sprites: {
    frontDefault: string;
    backDefault: string;
    frontShiny: string;
    backShiny: string;
  };
}
