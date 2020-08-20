import React, { memo, useEffect } from 'react';
import styled from 'styled-components';
import { Table, TabPane } from 'reactstrap';
import { observer } from 'mobx-react';
import useStores from '../../../stores/useStores';
import ReportUserList from './ReportUserList';

const ReportUser = () => {
  const { UserStore, UtilLoadingStore } = useStores();
  const { loadingProcess } = UtilLoadingStore;
  const { getUserBanned, banUserList } = UserStore;
  const BanUserList = banUserList.map(
    (v, index) => (<ReportUserList data={v} key={v.userId} index={index} />),
  );

  useEffect(() => {
    loadingProcess([
      getUserBanned,
    ]);
    getUserBanned();
  }, [getUserBanned, loadingProcess]);

  return (
    <TabPane tabId="ReportUser">
      <CodeTable bordered hover>
        <thead>
          <tr>
            <ThCenter width="7%">유저ID</ThCenter>
            <th width="15%">이름</th>
            <th width="15%">닉네임</th>
            <th width="15%">게임 닉네임</th>
            <th width="20%">이메일</th>
            <th width="15%">정지 기간</th>
            <th width="15%">처리</th>
          </tr>
        </thead>
        <tbody>
          {BanUserList}
        </tbody>
      </CodeTable>
    </TabPane>
  );
};

const CodeTable = styled(Table)`
  & > tbody > tr {
    cursor : pointer;
  }
  
  & > tbody > tr > td {
    vertical-align: middle;
  }
`;

const ThCenter = styled.td`
  text-align: center;
  font-weight: 600;
`;

export default memo(observer(ReportUser));