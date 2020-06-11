import React, { useLayoutEffect, memo } from 'react';
import styled from 'styled-components';
import * as Proptypes from 'prop-types';
import qs from 'query-string';
import BoardHeader from './BoardHeader';
import BoardContent from './BoardContent';
import BoardFooter from './BoardFooter';
import useStores from '../../../stores/useStores';

const Board = ({
  path, currentPage, isPagination, location,
}) => {
  const { BoardPostStore, UtilLoadingStore, BoardStore } = useStores();
  const { setClearPostView, getBoardPostNoticeList, getBoardPostList } = BoardPostStore;
  const { loadingProcess } = UtilLoadingStore;
  const {
    setCurrentBoardPath, judgeFilterMode, setCurrentBoardPage,
    setIsPagination,
  } = BoardStore;
  const query = qs.parse(location.search);

  // 차단목록?
  useLayoutEffect(() => {
    loadingProcess([
      () => setCurrentBoardPath(path),
      () => judgeFilterMode(query),
      () => setCurrentBoardPage(currentPage),
      () => setIsPagination(isPagination),
      () => getBoardPostNoticeList(path, currentPage),
      () => getBoardPostList(path, currentPage),
      setClearPostView,
    ]);
  }, [
    loadingProcess, setCurrentBoardPath, path, judgeFilterMode,
    query, setCurrentBoardPage, currentPage, setIsPagination, isPagination,
    getBoardPostNoticeList, getBoardPostList, setClearPostView,
  ]);

  return (
    <BoardWrapper>
      <TableWrapper>
        <BoardHeader />
        <BoardContent path={path} currentPage={currentPage} query={query} />
        <BoardFooter />
      </TableWrapper>
    </BoardWrapper>
  );
};

Board.propTypes = {
  path: Proptypes.string.isRequired,
  currentPage: Proptypes.string,
  isPagination: Proptypes.bool,
  location: Proptypes.shape({
    search: Proptypes.string,
  }).isRequired,
};

Board.defaultProps = {
  currentPage: '1',
  isPagination: false,
};

const BoardWrapper = styled.div`
  border-bottom: 2px solid #ebeae8;
  border-right: 2px solid #ebeae8;
  background-color : white;
`;

const TableWrapper = styled.div`
  padding : 20px;
  font-size : 13px !important;
`;

export default memo(Board);
