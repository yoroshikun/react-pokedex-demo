import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'react-grid-system';

import Pokedex from '../components/Pokedex';
import Search from '../components/Search';
import Selector from '../components/Selector';
import typeToColor from '../helpers/typeToColor';
import usePokedex from '../hooks/usePokedex';

const Index = () => {
  const [
    { pokemon, loading, error },
    { setPrevious, setCurrent, setNext },
  ] = usePokedex();

  const accentColor = useMemo(
    () =>
      pokemon &&
      typeToColor(pokemon.current ? pokemon.current.types[0].type : 'fire'),
    [pokemon],
  );

  return (
    <>
      <Head>
        <title>Pokedex</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Container fluid style={{ overflow: 'hidden' }}>
        <Row>
          <Col sm={2} style={{ background: '#010D27', height: '100vh' }}>
            <Search setCurrent={setCurrent} />
          </Col>
          {pokemon && (
            <Col sm={10} style={{ padding: 0 }}>
              {pokemon.current && (
                <Pokedex current={pokemon.current} accentColor={accentColor} />
              )}
              <Selector
                previous={pokemon.previous}
                next={pokemon.next}
                setPrevious={setPrevious}
                setNext={setNext}
              />
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Index;
