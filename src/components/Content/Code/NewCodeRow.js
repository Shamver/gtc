import React from 'react';
import { Button, Input } from 'reactstrap';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { faTimesCircle, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useStores from '../../../stores/useStores';

const NewCodeRow = () => {
  const { SystemCodeStore } = useStores();
  const {
    setIsAddCodeGroup, codeGroup, onChangeCodeGroup, addCodeGroup,
  } = SystemCodeStore;
  const { id, name, desc } = codeGroup;
  return (
    <tr>
      <td>
        <Input bsSize="sm" onChange={onChangeCodeGroup} name="id" value={id} placeholder="공통 코드" />
      </td>
      <td>
        <Input bsSize="sm" onChange={onChangeCodeGroup} name="name" value={name} placeholder="공통 코드명" />
      </td>
      <td width="67">
        <Input bsSize="sm" onChange={onChangeCodeGroup} name="desc" value={desc} placeholder="순서" />
      </td>
      <td>
        <Input bsSize="sm" onChange={onChangeCodeGroup} name="desc" value={desc} placeholder="공통 그룹 설명" />
      </td>
      <td>
        <Input type="select" bsSize="sm" onChange={onChangeCodeGroup} name="desc" value={desc} placeholder="공통 그룹 설명">
          <option value="Y">Y</option>
          <option value="N">N</option>
        </Input>
      </td>
      <CenterPaddingTd>
        <Button size="sm" color="danger" onClick={addCodeGroup}>
          <FontAwesomeIcon icon={faSave} />
        </Button>
      </CenterPaddingTd>
      <CenterPaddingTd>
        <Button size="sm" color="danger" onClick={() => setIsAddCodeGroup(false)}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </Button>
      </CenterPaddingTd>
    </tr>
  );
};

const CenterTd = styled.td`
  text-align : center;
`;

const CenterPaddingTd = styled(CenterTd)`
  padding : .8rem !important;
`;

export default observer(NewCodeRow);
