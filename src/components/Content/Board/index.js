import React, { useLayoutEffect, memo } from 'react';
import styled from 'styled-components';
import * as Proptypes from 'prop-types';
import qs from 'query-string';
import BoardHeader from './BoardHeader';
import BoardContent from './BoardContent';
import BoardFooter from './BoardFooter';
import useStores from '../../../stores/useStores';

const Board = ({
  path, currentPage, noPagination, location,
}) => {
  const { BoardPostStore, UtilLoadingStore } = useStores();
  const { setClearPostView } = BoardPostStore;
  const { loadingProcess } = UtilLoadingStore;
  const query = qs.parse(location.search);
  useLayoutEffect(() => {
    loadingProcess([
      setClearPostView,
    ]);
  }, [loadingProcess, setClearPostView]);
  return (
    <BoardWrapper>
      <TableWrapper>
        <BoardHeader path={path} />
        <BoardContent path={path} currentPage={currentPage} query={query} />
        <BoardFooter
          path={path}
          currentPage={currentPage}
          noPagination={noPagination}
          query={query}
        />
      </TableWrapper>
    </BoardWrapper>
  );
};

Board.propTypes = {
  path: Proptypes.string.isRequired,
  currentPage: Proptypes.string,
  noPagination: Proptypes.bool,
  location: Proptypes.shape({
    search: Proptypes.string,
  }).isRequired,
};

Board.defaultProps = {
  currentPage: '1',
  noPagination: false,
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
