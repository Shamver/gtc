import React, { useEffect, memo } from 'react';
import styled from 'styled-components';
import { Container, Row } from 'reactstrap';
import {
  faBars, faFlag, faList, faGlobeAsia, faTshirt, faLock,
  faComments, faCode,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react';
import { NavLink } from 'react-router-dom';
import useStores from '../../stores/useStores';

const Category = () => {
  const { UserStore, BoardPostStore } = useStores();
  const { userData, RouterAuthCheck } = UserStore;
  const { searchOff } = BoardPostStore;

  useEffect(() => {
  }, [userData]);

  return (
    <MainContainer>
      <MenuWrapper>
        <MenuRowTop>
          <MenuDivTop>
            <TopIcon icon={faBars} className="fa-fw" />&nbsp;&nbsp; GTC 전체 메뉴
          </MenuDivTop>
        </MenuRowTop>
        <MenuLink to="/notice" onClick={searchOff} activeClassName="active">
          <MenuDiv>
            <FaiPink icon={faFlag} className="fa-fw" />&nbsp;&nbsp; 공지사항
          </MenuDiv>
        </MenuLink>
        <MenuLink to="/all" onClick={searchOff} activeClassName="active">
          <MenuDiv>
            <FaiPink icon={faList} className="fa-fw" />&nbsp;&nbsp; 전체글 보기
          </MenuDiv>
        </MenuLink>
        <MenuLink to="/free" onClick={searchOff} activeClassName="active">
          <MenuDiv>
            <FaiPink icon={faGlobeAsia} className="fa-fw" />&nbsp;&nbsp; 자유 게시판
          </MenuDiv>
        </MenuLink>
        <MenuLink to="/trade" onClick={searchOff} activeClassName="active">
          <MenuDiv>
            <FaiPink icon={faTshirt} className="fa-fw" />&nbsp;&nbsp; 아이템 거래
          </MenuDiv>
        </MenuLink>
        <MenuLink to="/cash" onClick={searchOff} activeClassName="active">
          <MenuDiv>
            <FaiPink icon={faLock} className="fa-fw" />&nbsp;&nbsp; 월드락 거래
          </MenuDiv>
        </MenuLink>
        <MenuLink to="/qna" onClick={searchOff} activeClassName="active">
          <MenuDiv>
            <FaiPink icon={faComments} className="fa-fw" />&nbsp;&nbsp; 질문&답변
          </MenuDiv>
        </MenuLink>
        {/*
          <MenuLink to="/crime"  activeClassName="active">
            <MenuDiv>
              <FaiPink icon={faExclamationTriangle} className="fa-fw" />&nbsp;&nbsp; 신고 게시판
            </MenuDiv>
          </MenuLink>
          <MenuLink to="/faq" activeClassName="active">
          <MenuDiv>
          <FaiPink icon={faQuestion} className="fa-fw" />&nbsp;&nbsp; 자주 묻는 질문
          </MenuDiv>
          </MenuLink>
        <MenuLink to="/consult" activeClassName="active">
          <MenuDiv>
            <FaiPink icon={faAt} className="fa-fw" />&nbsp;&nbsp; 1:1 문의
          </MenuDiv>
        </MenuLink>
        */}
        { RouterAuthCheck(3) && (
          <MenuLink to="/code" activeClassName="active">
            <MenuDiv>
              <FaiPink icon={faCode} className="fa-fw" />&nbsp;&nbsp; 코드 관리
            </MenuDiv>
          </MenuLink>
        )}
      </MenuWrapper>
    </MainContainer>
  );
};

const MainContainer = styled(Container)`
  padding : 0px !important;
  border-bottom: 2px solid #ebeae8;
  border-right: 2px solid #ebeae8;

`;

const MenuWrapper = styled(Row)`
  margin : 0 !important;
  background-color :white;
  font-size : 15px;
`;

const MenuLink = styled(NavLink)`
  color: black;
  padding: 2px 0px;
  margin : 0 !important;
  width : 100%;
  margin-bottom: 0px !important;
  transition: all 0.18s;
  border-bottom : 1px solid #e6e6e6;
  
  &:hover {
    background-color: #ffc8c4;
    cursor: pointer;
    text-decoration: none;
    color: black;
  }
  &.active {
    background-color : #ffd7d4;
  }
`;

const MenuRow = styled(Row)`
  padding: 0px 0px;
  margin : 0 !important;
  width : 100%;
  margin-bottom: 3px !important;
  transition: all 0.2s;
  &:hover {
    background-color: #ffd7d4;
    cursor: pointer;
  }
`;

const MenuDiv = styled.div`
  padding: 3px 13px;
`;

const MenuRowTop = styled(MenuRow)`
  background-color: #DC3545;
  height: 35px;
  margin : 0px !important;
  margin-bottom: 0px !important;
  &:hover {
    background-color: #DC3545;
    cursor: default;
  }
`;

const MenuDivTop = styled.div`
  font-weight: bold; 
  color: white;
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 13px;
`;

const FaiPink = styled(FontAwesomeIcon)`
  color: #f57c73;
`;

const TopIcon = styled(FontAwesomeIcon)`
  margin: 0 auto;
  display: block;
  & > path {
    transform: translate(0px, -25px);
  }
`;


export default memo(observer(Category));
