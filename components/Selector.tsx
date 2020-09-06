import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-grid-system';
import { Pokemon } from '../types/pokedex';

const Footer = styled.div`
  background-color: #f2f3f5;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 160px;
`;
const Container = styled.div`
  max-width: 968px;
  margin: 0 auto;
`;

const ButtonLeft = styled.div`
  text-transform: capitalize;
  display: flex;
  justify-content: left;
  align-content: center;
`;

const ButtonRight = styled.div`
  text-transform: capitalize;
  display: flex;
  justify-content: right;
  align-content: center;
`;

const Selector = ({
  previous,
  next,
  setPrevious,
  setNext,
}: {
  previous?: Pokemon;
  next?: Pokemon;
  setPrevious: (id: number) => Promise<void>;
  setNext: (id: number) => Promise<void>;
}) => (
  <Footer>
    <Container>
      <Row>
        {previous ? (
          previous.sprites && (
            <Col md={6}>
              <div>
                <ButtonLeft onClick={() => setPrevious(previous.id)}>
                  {`< ${previous.name}`}
                  <img alt='' src={previous.sprites.frontDefault} />
                </ButtonLeft>
              </div>
            </Col>
          )
        ) : (
          <Col md={6} />
        )}
        {next ? (
          next.sprites && (
            <Col md={6}>
              <div>
                <ButtonRight onClick={() => setNext(next.id)}>
                  <img alt='' src={next.sprites.frontDefault} />
                  <p>{`${next.name} >`}</p>
                </ButtonRight>
              </div>
            </Col>
          )
        ) : (
          <Col md={6} />
        )}
      </Row>
    </Container>
  </Footer>
);

export default Selector;
