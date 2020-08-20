import React, { memo, useState } from 'react';
import {
  TabPane, Row, Col, Collapse, Card, CardBody, Input, Button,
} from 'reactstrap';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import useStores from '../../../../stores/useStores';
import * as Proptypes from 'prop-types';
import Pagination from '../Pagination';

const ConsultGetRow = (props) => {
  const {
    onClickRow, isOpen, data, addAnswer, onChangeValue, currentPage,
  } = props;
  const {
    subject, date, answerFl, consultDesc, answerDesc, category,
    userName, id, adminName,
  } = data;

  return (
    <>
      <ColItem onClick={() => onClickRow(id)} className={isOpen ? 'col-sm-12 head active' : 'col-sm-12 head'}>
        <Row>
          <ColItem className="col-sm-2">
            {category}
          </ColItem>
          <ColItem className="col-sm-5">
            {subject}
          </ColItem>
          <ColItem className="col-sm-2">
            {userName}
          </ColItem>
          <ColItem className="col-sm-2">
            {date}
          </ColItem>
          <ColItem className="col-sm-1">
            <CustomFontAwesome icon={answerFl ? faCheckCircle : faTimesCircle} color={answerFl ? 'green' : 'red'} />
          </ColItem>
        </Row>
      </ColItem>
      <ColItem className={isOpen ? 'col-sm-12 collapse-active' : 'col-sm-12 collapse-non-active'}>
        <Collapse isOpen={isOpen}>
          <Div>
            문의자: { userName }
            <Card>
              <CardBody className="bg-ask">
                {consultDesc}
              </CardBody>
            </Card>
          </Div>
          <Div className="answer" answerFl={answerFl}>
            답변자: { adminName || '(미답변 상태입니다.)' }
            <Card>
              <CardBody className="bg-answer new-line">
                {
                  answerFl
                    ? answerDesc
                    : (
                      <>
                        <Input
                          type="textarea"
                          className="text-area"
                          placeholder="답변을 입력해주세요."
                          name="answer"
                          onChange={onChangeValue}
                        />
                        <Button
                          className="mt-3 btn-sm"
                          color="primary"
                          onClick={() => addAnswer(id, currentPage)}
                        >
                          답변 등록
                        </Button>
                      </>
                      )
                }
              </CardBody>
            </Card>
          </Div>
        </Collapse>
      </ColItem>
    </>
  )
};

const ConsultGet = ({
 currentTab, currentPage, noPagination,
}) => {
  const { ConsultStore } = useStores();
  const {
    consultList, adminMaxPage, addConsultAnswer, onChangeValue,
  } = ConsultStore;
  const [openId, setOpenId] = useState(null);

  const onClickRow = (id) => id === openId ? setOpenId(null) : setOpenId(id);

  const test = consultList.map((v) =>
    <ConsultGetRow
      key={v.id}
      data={v}
      isOpen={v.id === openId}
      onClickRow={onClickRow}
      addAnswer={addConsultAnswer}
      onChangeValue={onChangeValue}
      currentPage={currentPage}
    />
  );

  return (
    <TabPane tabId="get">
      <Wrapper>
        <Row>
          <Col className="col-sm-12 content-header">
            <Row>
              <ColItem className="col-sm-2">
                종류
              </ColItem>
              <ColItem className="col-sm-5">
                제목
              </ColItem>
              <ColItem className="col-sm-2">
                닉네임
              </ColItem>
              <ColItem className="col-sm-2">
                날짜
              </ColItem>
              <ColItem className="col-sm-1">
                답변
              </ColItem>
            </Row>
          </Col>
          { test }
        </Row>
        <Pagination
          currentPage={currentPage}
          noPagination={noPagination}
          path={currentTab}
          maxPage={adminMaxPage}
        />
      </Wrapper>
    </TabPane>
  );
};

ConsultGet.propTypes = {
  currentPage: Proptypes.string.isRequired,
  currentTab: Proptypes.string.isRequired,
  noPagination: Proptypes.bool.isRequired,
};

const Wrapper = styled.div`
  padding: 6px 1rem;
  
  & .content-header {
    border-bottom: 1px solid;
  }
`;

const ColItem = styled(Col)`
  border: 1px solid;
  
  &.head, &.collapse-non-active {
    border: none;
  }
  &.collapse-active {
    border: 1px solid;
  }
  &.active {
    background-color: #d9d9d9;
  }
  &.head:hover {
    background-color: #d9d9d9;
    cursor: pointer;
  }
`;

const CustomFontAwesome = styled(FontAwesomeIcon)`
  padding-top: 2px;
`;

const Div = styled.div`
  padding: 1rem;
  width: 70%;
  
  &.answer {
    float: right;
    text-align: right;
  }
  
  & .bg-ask {
    background-color: #ededed;
  }
  
  & .bg-answer {
    background-color: ${(props) => props.answerFl ? '#deffec' : '#ffdede'};
  }
  
  & .new-line {
    white-space: pre;
  }
  
  & .text-area {
    height: 100px;
    resize: none;
  }
`;

export default memo(observer(ConsultGet));