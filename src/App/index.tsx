import React, { FC } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import '../static/css/fonts.css';
import '../static/css/index.css';
import styled from 'styled-components';
import Todos from '../Components/Todos';

const { Content } = Layout;

const Container = styled.div`
  max-width: 560px;
  margin: auto;
  padding-left: 15px;
  padding-right: 15px;
  width: 100%;
`;

const StyledContent = styled(Content)`
  padding: 35px 0;
`;

export const App: FC = () => {
  return (
    <Layout>
      <StyledContent>
        <Container>
          <Todos />
        </Container>
      </StyledContent>
    </Layout>
  );
};
