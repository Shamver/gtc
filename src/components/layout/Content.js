import React from 'react';
import { Switch, Route } from 'react-router';
import styled from 'styled-components';
import Main from '../Content/Main';
import Posting from '../Content/Posting';
import FreeBoard from '../Content/FreeBoard';
// import PostList from '../Content/PostList';
import Alert from '../util/Alert';
import Sign from '../util/Sign';
import ConfirmAlert from '../util/ConfirmAlert';
import Contents from '../Content';

const BorderedDiv = styled.div`
  border-bottom: 2px solid #ebeae8;
  border-right: 2px solid #ebeae8;
`;

const Content = () => (
  <BorderedDiv>
    <Switch>
      <Route exact path="/" render={() => <Main />} />
      <Route exact path="/:board/post" render={({ match }) => <Posting match={match} />} />
      <Route exact path="/free" render={({ location }) => <Contents.FreeBoard location={location} />} />
      <Route exact path="/settings" render={() => <Contents.Settings />} />
    </Switch>
    <Alert />
    <Sign />
    <ConfirmAlert />
  </BorderedDiv>
);


export default Content;
