import { observable, action } from 'mobx';
import axios from 'axios';
import { toast } from 'react-toastify';

class ReportStore {
  @observable reportToggle;

  @observable reportData = {
    targetId: '',
    type: '',
    content: '',
    writer: '',
    reason: '',
    reasonDetail: '',
  };

  constructor(root) {
    this.root = root;
  }

  @action report = () => {
    if (!this.ReportValidationCheck()) {
      return false;
    }
    console.log(this.reportData);

    axios.post('/api/board/report', this.reportData)
      .then((response) => {
        if (response.data) {
          toast.success('😳 해당 포스팅에 신고가 완료되었어요.');
        }
      })
      .catch((response) => { console.log(response); });

    return true;
  };

  ReportValidationCheck = () => {
    const { toggleAlert } = this.root.UtilAlertStore;

    // board
    if (!this.reportData.reason) {
      toggleAlert('신고 사유를 선택해주세요.');
      return false;
    }
    return true;
  };


  @action onChangeValue = (event) => {
    this.reportData = {
      ...this.reportData,
      [event.target.name]: event.target.value,
    };

  };

  @action toggleReport = (targetId, type, content, writer) => {
    console.log(writer);
    if (targetId) {
      this.reportData = {
        targetId,
        type,
        content,
        writer,
      };
    }

    this.reportToggle = !this.reportToggle;
  }
}

export default ReportStore;
