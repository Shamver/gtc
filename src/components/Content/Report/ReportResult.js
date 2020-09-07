import React, { memo, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { Col, Row, TabPane } from 'reactstrap';
import { observer } from 'mobx-react';
import * as Proptypes from 'prop-types';
import useStores from '../../../stores/useStores';
import ReportResultList from './ReportResultList';
import ReportPagination from './Pagination';

const ReportResult = ({ currentPage, noPagination }) => {
  const { BoardReportStore, UtilLoadingStore } = useStores();
  const { loadingProcess } = UtilLoadingStore;
  const {
    reportDataList, currentReportMaxPage, getReportList, activeTab,
  } = BoardReportStore;
  const reportResultList = reportDataList.map(
    (v, index) => (<ReportResultList data={v} key={v.reportId} index={index} />),
  );

  useLayoutEffect(() => {
    loadingProcess([
      () => getReportList(currentPage),
    ]);
  }, [loadingProcess, getReportList, currentPage, activeTab]);

  return (
    <TabPane tabId="ReportResult">
      <Wrapper size="sm">
        <Row className="content-header">
          <Col className="col-sm-12">
            <TableHeader>
              <ColCell className="col-1">
                신고ID
              </ColCell>
              <ColCell className="col-3">
                신고 사유
              </ColCell>
              <ColCell className="col-1">
                컨텐츠
              </ColCell>
              <ColCell className="col-1">
                신고자
              </ColCell>
              <ColCell className="col-1">
                피신고자
              </ColCell>
              <ColCell className="col-2">
                신고날짜
              </ColCell>
              <ColCell className="col-1">
                처리결과
              </ColCell>
              <ColCell className="col-2">
                처리날짜
              </ColCell>
            </TableHeader>
          </Col>
        </Row>
        {reportResultList}
      </Wrapper>
      {currentReportMaxPage !== 0
        ? (<ReportPagination currentPage={currentPage} noPagination={noPagination} />)
        : ''}
    </TabPane>
  );
};

ReportResult.propTypes = {
  currentPage: Proptypes.string.isRequired,
  noPagination: Proptypes.bool.isRequired,
};

const Wrapper = styled.div`
  padding: 0px 1rem;
  border-bottom: 1px solid #dee2e6;
  
  & .content-header {
    border-bottom: 1px solid #dee2e6;
  }
  
  @media (max-width: 740px) {
    & .content-header {
      display: none;
    }
    
    & .content-body {
      display: block;
    }
    
    .col {
      max-width: 100%;
    }
  }
`;

const TableHeader = styled(Row)`
  border: 1px solid #dee2e6;
  border-bottom: 0;
  
`;

const ColCell = styled(Col)`
  padding: 12px 6px;
`;

export default memo(observer(ReportResult));
