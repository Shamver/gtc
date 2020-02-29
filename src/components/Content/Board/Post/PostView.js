import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import * as Proptypes from 'prop-types';
import styled from 'styled-components';
import useStores from '../../../../stores/useStores';
import PostContent from './PostContent';

const PostView = ({ match }) => {
  const {
    BoardPostStore, BoardReplyStore, BoardStore, UtilLoadingStore,
  } = useStores();
  const { getPost, getPostUpperLower } = BoardPostStore;
  const { setReplyBpId } = BoardReplyStore;
  const { setCurrentBoardToId } = BoardStore;
  const { doLoading } = UtilLoadingStore;
  const { params } = match;
  const { id } = params;

  doLoading();

  useEffect(() => {
    setCurrentBoardToId(id);
    getPost(id);
    getPostUpperLower(id);
    setReplyBpId(id);
  }, [
    getPost, setReplyBpId, id, setCurrentBoardToId, getPostUpperLower,
  ]);

  return (
    <PostWrapper>
      <PostContent match={match} />
    </PostWrapper>
  );
};

PostView.propTypes = {
  match: Proptypes.shape({
    params: Proptypes.shape({
      id: Proptypes.string,
    }),
  }),
};

PostView.defaultProps = {
  match: null,
};

const PostWrapper = styled.div`
  background-color : white;
  border-bottom: 2px solid #ebeae8;
  border-right: 2px solid #ebeae8;
  
  & .ck-content {
    height : 100px;
    font-family: 'Nanum Gothic',sans-serif !important;
  }
  
  & .ck.ck-editor {
    margin-bottom : 5px !important;
    border-radius: 0 0 2px 2px;
    box-shadow: 0.8px 0.8px 1px 0.8px rgb(0,0,0,.12);
  }
`;

export default observer(PostView);
