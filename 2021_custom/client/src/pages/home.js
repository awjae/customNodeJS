import React from 'react';
import styled from 'styled-components';

const Home = () => {
  return (
    <div className="container">
      <Title>Hello World!</Title>
      <p>Webpack + Babel + React + React router + </p>
    </div>
  );
};

export default Home;

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;