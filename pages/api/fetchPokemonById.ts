import { NextApiRequest, NextApiResponse } from 'next';
import { Pokemon } from '../../types/pokeAPI';

// This is api to de-couple API Tokens from users computer, although this API ..
// .. does not use an API Token or Authentication, many others do
// This is also used to reduce the data sent to the client
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

    if (!response.ok) {
      throw new Error(
        `Looks like there was a problem. Status Code: ${response.status}`,
      );
    }

    const json = await response.json();

    const { name, weight, height, stats, types, sprites } = json as Pokemon;

    const pokemonData = {
      id: parseInt(id, 10),
      name,
      weight: (weight / 10).toFixed(1),
      height: (height / 10).toFixed(1),
      stats: stats
        .map(({ base_stat: baseStat, stat: { name: statName } }) => ({
          baseStat,
          name: statName,
        }))
        .reverse(),
      types: types
        .map(({ slot, type: { name: type } }) => ({
          slot,
          type,
        }))
        .sort((a, b) => a.slot - b.slot),
      sprites: {
        frontDefault: sprites.front_default,
        backDefault: sprites.back_default,
        frontShiny: sprites.front_shiny,
        backShiny: sprites.back_shiny,
      },
    };

    res.statusCode = 200;
    res.json(pokemonData);
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err.message || JSON.stringify(err) });
  }
};
