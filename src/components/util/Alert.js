import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import * as Proptypes from 'prop-types';
import { useStores } from '../../stores/useStores';

const Alert = () => {
  const { UtilStore } = useStores();
  useEffect(() => {
    console.log('렌더링이 완료되었습니다!');
  });
  return (

    <div>
      <Modal isOpen={UtilStore.alertToggle} toggle={() => { UtilStore.toggleAlert(''); }}>
        <ModalHeader toggle={() => { UtilStore.toggleAlert(''); }}>알림</ModalHeader>
        <ModalBody>
          {UtilStore.text}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => { UtilStore.toggleAlert(''); }}>닫기</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
};

Alert.propTypes = {
  UtilStore: Proptypes.shape({
    alertToggle: Proptypes.bool,
    toggleAlert: Proptypes.func,
    text: Proptypes.string,
  }),
};

Alert.defaultProps = {
  UtilStore: null,
};

export default (observer(Alert));
