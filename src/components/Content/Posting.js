import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import {
  CustomInput, Button, Input, Row, Col,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import { useStores } from '../../stores/useStores';

const PostingWrapper = styled.div`
  background-color : white;
  padding : 14px;
  
  & .ql-container {
    height : 500px;
    font-family: 'NanumSquareRound',sans-serif !important;
  }
`;

const CustomCheckbox = styled(CustomInput)`
  display : inline !important;
  margin-right : 10px;
`;

const MarginButton = styled(Button)`
  margin-right : 5px;
`;

const RightButton = styled(Button)`
  float : right;
`;

const PostingFooter = styled.div`
  margin-top : 15px;
`;

const PostingHeader = styled(Row)`
  padding : 10px 0px;
`;

const SelectInput = styled(Input)`
  margin-bottom : 10px;
`;

const Posting = () => {
  const { ContentStore } = useStores();
  const { post } = ContentStore;

  return (
    <PostingWrapper>
      <PostingHeader>
        <Col xs="12">
          <SelectInput type="select" name="select" id="exampleSelect">
            <option>공지사항</option>
            <option>자유 게시판</option>
            <option>아이템 거래</option>
            <option>월드락 거래</option>
            <option>신고 게시판</option>
            <option>질문 & 답변</option>
          </SelectInput>
        </Col>
        <Col xs="2">
          <CustomCheckbox type="select" id="exampleCustomSelect" name="customSelect">
            <option value="FREE">자유</option>
          </CustomCheckbox>
        </Col>
        <Col>
          <Input value={post.title} placeholder="제목을 입력해주세요..." onChange={ContentStore.onChangeValue} name="title" />
        </Col>
      </PostingHeader>
      <ReactQuill value={post.text} onChange={ContentStore.onChangeValue} name="text" />
      <PostingFooter>
        <CustomCheckbox type="checkbox" id="exampleCustomCheckbox" label="댓글 허용" />
        <CustomCheckbox type="checkbox" id="exampleCustomCheckbox2" label="비밀글" />
        <CustomCheckbox type="checkbox" id="exampleCustomCheckbox3" label="비밀 댓글 허용" />
      </PostingFooter>
      <PostingFooter>
        <MarginButton color="secondary">작성취소</MarginButton>
        <MarginButton color="info">
          <FontAwesomeIcon icon={faChartBar} />
          &nbsp;설문 추가
        </MarginButton>
        <RightButton color="danger" onClick={ContentStore.addPost}>
          <FontAwesomeIcon icon={faPen} />
          &nbsp;쓰기
        </RightButton>
      </PostingFooter>
    </PostingWrapper>
  );
};

Posting.propTypes = {
  ContentStore: PropTypes.shape({
    post: PropTypes.shape({
      title: PropTypes.string,
      text: PropTypes.string,
    }),
    onChangeValue: PropTypes.func,
    addPost: PropTypes.func,
  }),
  UtilStore: PropTypes.shape({
    toggleAlert: PropTypes.func,
  }),
};


Posting.defaultProps = {
  ContentStore: null,
  UtilStore: null,
};

export default (observer(Posting));
