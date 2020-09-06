import React, { useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-grid-system';
import typeToColor from '../helpers/typeToColor';
import { Pokemon } from '../types/pokedex';

const SlantRectangle = styled.div`
  background-color: ${({ accentColor }: { accentColor: string }) =>
    accentColor || 'red'};
  width: 2500px;
  height: 600px;
  position: absolute;
  z-index: -1;
  transform: rotate(-4.25deg) translateY(-300px) translateX(-350px);
  transform-origin: center;
  transition: background-color 0.375ms cubic-bezier(0.4, 0, 0.2, 1);
`;

const PokemonHeadingName = styled.h1`
  font-size: 2.5rem;
  margin-top: 0;
  color: white;
  text-transform: uppercase;
`;

const Container = styled.div`
  max-width: 968px;
  margin: 8rem auto 0 auto;
`;

const Subheading = styled.p`
  font-size: 0.75rem;
  color: black;
  margin: 0.25rem 0 0.2rem 0;
  text-transform: uppercase;
`;

const Type = styled.p`
  color: ${({ color }: { color: string }) => color || 'black'};
  font-size: 1.2rem;
  text-transform: capitalize;
  margin-top: 0.5rem;
  margin-bottom: 0;
`;

const InfoItem = styled.p`
  font-size: 1.2rem;
  margin: 0.5rem 0 1rem 0;
`;

const GreenScreen = styled.div`
  background-color: #b1fb93;
  padding: 2rem 2rem 1.25rem 2rem;
  margin-bottom: 2rem;
  border-radius: 6px;
`;

const ProgressBarOuter = styled.div`
  background-color: #f0fcec;
  border-radius: 3px;
  margin-bottom: 0.6rem;
  margin-top: 0.4rem;
`;

const ProgressBarInner = styled.div`
  background-color: #77ccd4;
  color: white;
  width: ${({ width }: { width: string }) => width || '30%'};
  height: 100%;
  padding: 0.5rem 0rem 0.5rem 0.75rem;
  border-radius: 3px;
`;

const ViewerOuter = styled.div`
  background-color: #f0fcec;
  border-radius: 3px;
  padding: 1.25rem 1.25rem 0.25rem 1.25rem;
  margin-bottom: 2rem;
`;

const ViewerInner = styled.div`
  background-color: #77ccd4;
  text-align: center;
  vertical-align: center;
  > img {
    height: 256px;
    width: 256px;
  }
`;

const ViewerCircle = styled.div`
  margin: 6px 6px 6px 12px;
  height: 20px;
  width: 20px;
  border-radius: 100%;
  background-color: #f4504f;
  &:hover {
    background-color: '#b1fb93';
  }
`;

const ViewerLinesContainer = styled.div`
  position: relative;
  float: right;
  top: -32px;
  margin: 6px 12px 6px 6px;
`;

const ProgressBar = ({ baseStat }: { baseStat: number }) => (
  <ProgressBarOuter>
    <ProgressBarInner width={`${(baseStat / 255) * 100}%`}>
      {baseStat}
    </ProgressBarInner>
  </ProgressBarOuter>
);

const ViewerLines = ({ onClick }: { onClick: () => void }) => (
  <ViewerLinesContainer {...{ onClick }}>
    <svg height='25' width='30'>
      <line
        x1='2'
        y1='3'
        x2='28'
        y2='3'
        strokeWidth='3px'
        stroke='black'
        strokeLinecap='round'
      />
      <line
        x1='2'
        y1='9'
        x2='28'
        y2='9'
        strokeWidth='3px'
        stroke='black'
        strokeLinecap='round'
      />
      <line
        x1='2'
        y1='15'
        x2='28'
        y2='15'
        strokeWidth='3px'
        stroke='black'
        strokeLinecap='round'
      />
      <line
        x1='2'
        y1='21'
        x2='28'
        y2='21'
        strokeWidth='3px'
        stroke='black'
        strokeLinecap='round'
      />
    </svg>
  </ViewerLinesContainer>
);

const Pokedex = ({
  current,
  accentColor,
}: {
  current: Pokemon;
  accentColor: string;
}) => {
  const [shiny, setShiny] = useState(false);
  const [back, setBack] = useState(false);

  const sprite = useMemo(() => {
    const {
      backDefault,
      backShiny,
      frontDefault,
      frontShiny,
    } = current.sprites;
    if (!shiny && !back) {
      return frontDefault;
    }
    if (shiny && !back) {
      return frontShiny;
    }
    if (!shiny && back) {
      return backDefault;
    }
    if (shiny && back) {
      return backShiny;
    }
    return frontDefault;
  }, [current.sprites, shiny, back]);

  const switchSprite = useCallback(
    (type: 'shiny' | 'back') => {
      if (type === 'shiny') {
        setShiny(!shiny);
      }
      if (type === 'back') {
        setBack(!back);
      }
    },
    [setShiny, setBack, shiny, back],
  );

  const { id, name, weight, height, stats, types } = current;

  return (
    <>
      <SlantRectangle accentColor={accentColor} />
      <Container>
        <Row>
          <Col sm={4}>
            <ViewerOuter>
              <ViewerInner>
                <img alt='loading...' src={sprite} />
              </ViewerInner>
              <div>
                <ViewerCircle onClick={() => switchSprite('shiny')} />
                <ViewerLines onClick={() => switchSprite('back')} />
              </div>
            </ViewerOuter>
            <Subheading>TYPE</Subheading>
            {types &&
              types.map(({ type }, index) => (
                <Type key={`type-${index}`} color={typeToColor(type)}>
                  {type}
                </Type>
              ))}
          </Col>
          <Col sm={8}>
            <PokemonHeadingName>{name}</PokemonHeadingName>
            <GreenScreen>
              <Subheading>NO</Subheading>
              <InfoItem>#{String(id).padStart(3, '0')}</InfoItem>
              <Subheading>WEIGHT</Subheading>
              <InfoItem>{weight}kg</InfoItem>
              <Subheading>HEIGHT</Subheading>
              <InfoItem>{height}m</InfoItem>
            </GreenScreen>
            {stats &&
              stats.map(({ baseStat, name: statName }) => (
                <div key={statName}>
                  <Subheading>{statName}</Subheading>
                  <ProgressBar baseStat={baseStat} />
                </div>
              ))}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Pokedex;
