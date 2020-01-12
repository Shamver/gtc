import React, { useEffect } from 'react';
import {
  Container, Button,
} from 'reactstrap';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Link } from 'react-router-dom';
import Loading from '../util/Loading';


import useStores from '../../stores/useStores';

const MainContainer = styled(Container)`
  background-color: white;
  padding: 1rem !important;
`;

const NotifyHeader = styled.div`
  width: 100%;
  display: flex;
`;

const FlexDiv = styled.div`
  flex: 1;
`;

const H4 = styled.h4`
  padding: 0 !important;
  margin: 0 !important;
`;

const Hr = styled.hr`
  margin-top: 22px;
  margin-bottom: 20px;
  margin-left: 0;
  border: 0;
  border-top: 1px solid #eee;
`;

const ReadAll = styled.div`
  flex: none;
  width: 140px;
  text-align: right;
`;

const ReadAllButton = styled(Button)`
  background-color: white !important;
  color: black !important;
  border-color: #ccc !important;
  
  &:hover {
    background-color: #e6e6e6 !important;
    border-color: #adadad !important;
  }
`;

const AlertWrapper = styled.div`
  padding: 6px 8px;
  border-bottom: 1px solid #dddfe2;
  display: flex;
  width: 100%;
  &.noRead {
    background-color: #edf2fa;
  }
  
  &:hover {
    background: linear-gradient(rgba(29,33,41,.04),rgba(29,33,41,.04));
  }
`;

const AlertBox = styled.div`
  flex: 1;
`;

const AlertActionBox = styled.div`
  width: 80px;
  text-align: right;
`;

const LinkA = styled(Link)`
  display: block;
  font-size: 0.9rem;
  text-decoration: none !important;
  color: #666 !important;
  overflow: hidden !important;
  &:hover {
    cursor: pointer;
  }
`;

const DateSpan = styled.span`
  font-size: 0.7rem;
  color: #a9a;
`;

const DeleteA = styled.a`
  color: #333;
  text-decoration: none;
  padding: 6px 8px 4px 8px;
  &:hover {
    cursor: pointer;
    background-color: #eaefec;
  }
`;

const StrongSpan = styled.span`
  font-weight: 750;
`;

const AlertData = (data, onLink, onDelete) => (
  <AlertWrapper className={data.isRead === 'Y' ? '' : 'noRead'}>
    <AlertBox>
      <LinkA to={`/post/${data.postId}#${data.replyId}`} name={`${data.id}`} onClick={onLink}>
        <StrongSpan>{data.replyName}</StrongSpan>님이 <StrongSpan>{data.postTitle}</StrongSpan>
        에 새&nbsp;
        {data.type === 'reply' ? '댓글' : '대댓글'}을 달았습니다:&nbsp;
        {data.replyContent}
      </LinkA>
      <DateSpan>{data.replyDate}</DateSpan>
    </AlertBox>
    <AlertActionBox>
      <DeleteA onClick={onDelete} name={`${data.id}`}>
        <FontAwesomeIcon icon={faTimes} />
      </DeleteA>
    </AlertActionBox>
  </AlertWrapper>
);

// 알림의 종류는 새 댓글, 새 대댓글만 우선
const NewAlert = () => {
  const { NewAlertStore, UtilStore } = useStores();

  const {
    getDataAlert, onDeleteAlert, onLink, onReadAlertAll, alertList,
  } = NewAlertStore;

  const {
    toggleConfirmAlert, loading, setLoading,
  } = UtilStore;

  useEffect(() => {
    getDataAlert();

    return () => {
      setLoading(true);
    };
  }, [getDataAlert, setLoading]);

  const Alerts = alertList.map((v) => (AlertData(v, onLink, onDeleteAlert)));

  if (loading) {
    return (
      <Loading />
    );
  }
  return (
    <MainContainer>
      <NotifyHeader>
        <FlexDiv>
          <H4>내 알림</H4>
          <Hr width={120} />
        </FlexDiv>
        <ReadAll>
          <ReadAllButton onClick={() => { toggleConfirmAlert('모두 읽음 처리 하시겠습니까?', onReadAlertAll); }}>
            모두 읽음 처리
          </ReadAllButton>
        </ReadAll>
      </NotifyHeader>
      {Alerts.length === 0 ? '새로운 알림이 없습니다.' : Alerts}
    </MainContainer>
  );
};

export default observer(NewAlert);
