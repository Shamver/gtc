import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faStar, faImage } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import * as Proptypes from 'prop-types';
import WriterDropdown from './WriterDropdown';
import useStores from '../../../../../stores/useStores';

const ResponsiveRow = ({
  data, index, path, isNotice,
}) => {
  const {
    id, recommendCount, categoryName, commentCount,
    type, title, boardName, isImage,
  } = data;
  const { ComponentPostStore } = useStores();
  const { onClickPost, isVisited } = ComponentPostStore;

  // eslint-disable-next-line no-nested-ternary
  const IsBestPost = recommendCount >= 10
    ? (<Star icon={faStar} />)
    : isImage ? (<FontAwesomeIcon icon={faImage} />)
      : (<BottomIcon icon={faCommentDots} />);

  return (
    <>
      { path === 'all' ? (
        <DateTd>
          {!isNotice ? boardName : ''}
        </DateTd>
      ) : null }
      { !isNotice ? (
        <DateTd>
          { type !== 'notice' ? categoryName : ''}
        </DateTd>
      ) : '' }
      <MiddleTd width="700" colSpan={isNotice ? 2 : 1}>
        <MiddleSpan>
          { isNotice ? (<BottomIcon icon={faInfoCircle} />) : IsBestPost}
          &nbsp;
          <PostTitle className={isVisited(id) ? 'color-gray' : ''} onClick={() => onClickPost(id)}>{title}</PostTitle>
          { commentCount > 0
            ? (
              <ReplyCountspan>
                &nbsp;&nbsp;&nbsp;
                [{commentCount}]
              </ReplyCountspan>
            ) : null}
          <MobileWriterDropdown>
            <WriterDropdown data={data} index={index} />
            <TopSpan>{type !== 'notice' ? categoryName : ''}</TopSpan>
          </MobileWriterDropdown>
        </MiddleSpan>
      </MiddleTd>
      <CenterTdWriter>
        <WriterDropdown data={data} index={index} />
      </CenterTdWriter>
    </>
  );
};

ResponsiveRow.propTypes = {
  data: Proptypes.shape({
    id: Proptypes.number,
    title: Proptypes.string,
    categoryName: Proptypes.string,
    recommendCount: Proptypes.number,
    commentCount: Proptypes.number,
    type: Proptypes.string,
    boardName: Proptypes.string,
    isImage: Proptypes.bool,
  }).isRequired,
  index: Proptypes.number.isRequired,
  path: Proptypes.string.isRequired,
  isNotice: Proptypes.bool.isRequired,
};

const BottomIcon = styled(FontAwesomeIcon)`
  vertical-align : bottom;
`;

const MiddleSpan = styled.span`
  vertical-align : middle !important;
  display : block;
  line-height : normal;
`;

const TopSpan = styled.span`
  margin-left : 10px;
  vertical-align : top;
`;

const MobileWriterDropdown = styled.div`
  display : none !important;
  padding-top: 5px;
  @media (max-width: 992px) {
    display : block !important;
  }
`;

const DateTd = styled.td`
  white-space : pre;
  text-align : center;
  vertical-align : middle !important;
  padding : 0rem 0.5rem !important;
  @media (max-width: 992px) {
    display : none;
  }
`;

const Star = styled(FontAwesomeIcon)`
  color : #efc839;
`;

const ReplyCountspan = styled.span`
  color: #DC3545;
  font-weight: bold;
`;

const MiddleTd = styled.td`
  padding : 0px 0.5rem !important;
  vertical-align : middle !important;
  font-size : 14px;
  @media (max-width: 992px) {
    height : 50px;
  }
  
`;

const CenterTd = styled(MiddleTd)`
  text-align : center;
`;

const CenterTdWriter = styled(CenterTd)`
  color : #DC3545;
  font-weight : bold;
  @media (max-width: 992px) {
    display : none;
  }
`;

const PostTitle = styled.a`
  cursor: pointer
  color : black;
  
  &.color-gray {
    color: #b0b0b0 !important;
  }
  
  &:hover {
    text-decoration: none;
  }
`;

export default ResponsiveRow;
