import React, { useEffect, lazy, memo } from 'react';
import { Route, Switch } from 'react-router';
import { observer } from 'mobx-react';
import Contents from '../../Content';
import useStores from '../../../stores/useStores';
import AuthRouter from './AuthRouter';

const Home = lazy(() => import('../../Content/Home'));
const Posting = lazy(() => import('../../Content/Board/Posting'));

const SwitchList = () => {
  const { UserStore } = useStores();
  const { RouterAuthCheck, userData } = UserStore;

  useEffect(() => {
  }, [userData]);

  return (
    <Switch>
      { RouterAuthCheck(0) ? (
        <Route exact path="/mail" render={() => <Contents.Mail />} />
      ) : null }

      { RouterAuthCheck(0) ? (
        <Route exact path="/postlocker" render={() => <Contents.PostLocker />} />
      ) : null }

      { RouterAuthCheck(0) ? (
        <Route exact path="/setting" render={() => <Contents.Setting />} />
      ) : null }

      <AuthRouter Component={Contents.NewAlert} level={0} path="/newalert" />

      {/*{ RouterAuthCheck(0) ? (*/}
      {/*  <Route exact path="/newalert" render={() => <Contents.NewAlert />} />*/}
      {/*) : null }*/}

      { RouterAuthCheck(0) ? (
        <Route exact path="/myaccount" render={() => <Contents.MyAccount />} />
      ) : null }

      { RouterAuthCheck(0) ? (
        <Route exact path="/mypoint" render={() => <Contents.MyPoint noPagination />} />
      ) : null }

      { RouterAuthCheck(0) ? (
        <Route exact path="/mypoint/page/:currentPage" render={({ match }) => <Contents.MyPoint currentPage={match.params.currentPage} />} />
      ) : null }

      { RouterAuthCheck(0) ? (
        <Route exact path="/daily" render={() => <Contents.Daily />} />
      ) : null }

      { RouterAuthCheck(0) ? (
        <Route exact path="/advertise" render={() => <Contents.Advertise />} />
      ) : null }

      { RouterAuthCheck(2) ? (
        <Route exact path="/code" render={() => <Contents.Code />} />
      ) : null }

      { RouterAuthCheck(0) ? (
        <Route exact path="/search" render={({ location }) => <Contents.Search location={location} />} />
      ) : null }

      { RouterAuthCheck(0) ? (
        <Route exact path="/search/page/:currentPage" render={({ match, location }) => <Contents.Search currentPage={match.params.currentPage} isPagination location={location} />} />
      ) : null }

      <Route exact path="/" render={() => <Home />} />

      {/* ------------------------------- Test Component ------------------------------- */}
      <Route exact path="/test" render={() => <Contents.Test />} />

      {/* ------------------------------- BOARD ------------------------------- */}
      <Route exact path="/:board" render={({ match, location }) => <Contents.Board path={match.params.board} location={location} />} />
      <Route exact path="/:board/page/:currentPage" render={({ match, location }) => <Contents.Board path={match.params.board} isPagination currentPage={match.params.currentPage} location={location} />} />

      { RouterAuthCheck(0) ? (
        <Route exact path="/post/:id" render={({ match, location }) => <Contents.PostView match={match} location={location} />} />
      ) : null }

      { RouterAuthCheck(0) ? (
        <Route exact path="/:board/post" render={({ match }) => <Posting match={match} />} />
      ) : null }

      { RouterAuthCheck(0) ? (
        <Route exact path="/:board/modify/:id" render={({ match }) => <Posting match={match} isModify />} />
      ) : null }
    </Switch>
  );
};

export default memo(observer(SwitchList));
