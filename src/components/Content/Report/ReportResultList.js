import React, { memo } from 'react';
import styled from 'styled-components';
import * as Proptypes from 'prop-types';

const ReportResultList = ({ data, index }) => {
  const {
    userId, reason, reportDate, targetName, targetContents, reportResult,
  } = data;

  return (
    <tr>
      <TdCenter>{index + 1}</TdCenter>
      <td>{reason}</td>
      <td>{userId}</td>
      <td>{targetName}</td>
      <td>{targetContents}</td>
      <td>{reportDate}</td>
      <td>{reportDate}</td>
      <td>{reportResult}</td>
    </tr>
  );
};

ReportResultList.propTypes = {
  data: Proptypes.shape({
    reportId: Proptypes.number,
    userId: Proptypes.string,
    reason: Proptypes.string,
    reasonDetail: Proptypes.string,
    targetContents: Proptypes.string,
    reportDate: Proptypes.string,
    targetName: Proptypes.string,
    reportResult: Proptypes.string,
  }).isRequired,
  index: Proptypes.number.isRequired,
};

const TdCenter = styled.td`
  text-align: center;
`;

export default memo(ReportResultList);
