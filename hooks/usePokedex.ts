import { useEffect, useCallback, useReducer } from 'react';
import { parse } from 'query-string';
import { Pokemon } from '../types/pokedex';

const fetchPokemon = async (id: number): Promise<Pokemon> => {
  const response = await fetch(`/api/fetchPokemonById?id=${id}`);

  if (!response.ok) {
    throw new Error(
      (await response.json()) || 'An error occured when fetching a pokemon',
    );
  }

  const jsonData = (await response.json()) as Pokemon;

  return jsonData;
};

type State = {
  pokemon: { previous?: Pokemon; current?: Pokemon; next?: Pokemon };
  cache: { [key: number]: Pokemon };
  loading: boolean;
  error?: Error | string;
};

type Action =
  | { type: 'update_previous_pokemon'; pokemon: Pokemon | undefined }
  | { type: 'update_current_pokemon'; pokemon: Pokemon | undefined }
  | { type: 'update_next_pokemon'; pokemon: Pokemon | undefined }
  | { type: 'update_pokemon'; pokemon: State['pokemon'] }
  | { type: 'loading'; payload: boolean };

const pokedexReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'update_previous_pokemon':
      return {
        ...state,
        cache: {
          ...state.cache,
          ...(action.pokemon ? { [action.pokemon.id]: action.pokemon } : {}),
        },
        pokemon: {
          previous: action.pokemon,
          current: state.pokemon.previous,
          next: state.pokemon.current,
        },
      };
    case 'update_current_pokemon':
      return {
        ...state,
        cache: {
          ...state.cache,
          ...(action.pokemon ? { [action.pokemon.id]: action.pokemon } : {}),
        },
        pokemon: {
          previous: state.pokemon.previous,
          current: action.pokemon,
          next: state.pokemon.current,
        },
      };
    case 'update_next_pokemon':
      return {
        ...state,
        cache: {
          ...state.cache,
          ...(action.pokemon ? { [action.pokemon.id]: action.pokemon } : {}),
        },
        pokemon: {
          previous: state.pokemon.current,
          current: state.pokemon.next,
          next: action.pokemon,
        },
      };
    case 'update_pokemon':
      return {
        ...state,
        cache: {
          ...state.cache,
          ...(action.pokemon.previous
            ? { [action.pokemon.previous.id]: action.pokemon.previous }
            : {}),
          ...(action.pokemon.current
            ? { [action.pokemon.current.id]: action.pokemon.current }
            : {}),
          ...(action.pokemon.next
            ? { [action.pokemon.next.id]: action.pokemon.next }
            : {}),
        },
        pokemon: action.pokemon,
      };
    case 'loading':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const usePokedex = (): [
  State,
  {
    setPrevious: (id: number) => Promise<void>;
    setCurrent: (id: number) => Promise<void>;
    setNext: (id: number) => Promise<void>;
  },
] => {
  const [
    { pokemon, cache, loading, error },
    dispatch,
  ] = useReducer(pokedexReducer, { pokemon: {}, cache: {}, loading: true });

  const setPrevious = useCallback(
    async (id: number) =>
      dispatch({
        type: 'update_previous_pokemon',
        pokemon:
          id - 1 > 0
            ? cache[id - 1]
              ? cache[id - 1]
              : await fetchPokemon(id - 1)
            : undefined,
      }),
    [dispatch, cache],
  );

  const setCurrent = useCallback(
    async (id: number) => {
      const pokemon = await Promise.all([
        ...(id - 1 > 0
          ? cache[id - 1]
            ? [cache[id - 1]]
            : [await fetchPokemon(id - 1)]
          : [undefined]),
        await fetchPokemon(id),
        ...(id + 1 < 803
          ? cache[id + 1]
            ? [cache[id + 1]]
            : [await fetchPokemon(id + 1)]
          : [undefined]),
      ]);

      dispatch({
        type: 'update_pokemon',
        pokemon: {
          previous: pokemon[0],
          current: pokemon[1],
          next: pokemon[2],
        },
      });
    },
    [dispatch, cache],
  );

  const setNext = useCallback(
    async (id: number) => {
      dispatch({
        type: 'update_next_pokemon',
        pokemon:
          id + 1 < 803
            ? cache[id + 1]
              ? cache[id + 1]
              : await fetchPokemon(id + 1)
            : undefined,
      });
    },
    [dispatch, cache],
  );

  const initialize = useCallback(async () => {
    const queryId =
      typeof window !== undefined
        ? parseInt(parse(window.location.search).id as string, 10)
        : undefined;
    const id = queryId && queryId > 0 && queryId < 803 ? queryId : 4;

    const pokemon = await Promise.all([
      ...(id - 1 > 0 ? [await fetchPokemon(id - 1)] : [undefined]),
      await fetchPokemon(id),
      ...(id + 1 < 803 ? [await fetchPokemon(id + 1)] : [undefined]),
    ]);

    dispatch({
      type: 'update_pokemon',
      pokemon: { previous: pokemon[0], current: pokemon[1], next: pokemon[2] },
    });

    dispatch({ type: 'loading', payload: false });
  }, [dispatch]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (pokemon?.current) {
      const { id } = pokemon.current;
      if (id) {
        window.history.pushState({ id: id }, 'Pokedex', `/?id=${id}`);
      }
    }
  }, [pokemon]);

  return [
    { pokemon, cache, loading, error },
    { setPrevious, setCurrent, setNext },
  ];
};

export default usePokedex;
