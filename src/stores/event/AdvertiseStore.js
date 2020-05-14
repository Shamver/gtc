import { observable, action } from 'mobx';
import axios from 'axios';
import { toast } from 'react-toastify';

class AdvertiseStore {
  @observable AdvertisePostList = [];

  @observable AdvertisePostListNow = [];

  @observable AdvertisePost = {
    message: '',
    url: '',
    hours: 1,
  };

  constructor(root) {
    this.root = root;
  }

  @action AddAdPostList = () => {
    const { userData } = this.root.UserStore;
    const { toggleAlert } = this.root.UtilAlertStore;
    const { totalPoint } = this.root.UserPointStore;

    if (!userData) {
      toggleAlert('로그인 후 이용 가능합니다.');
      return;
    }
    if (this.AdvertisePost.message === '') {
      toggleAlert('메시지는 공백이 될 수 없습니다.');
      return;
    }
    if (parseInt(this.AdvertisePost.hours, 10) === 0 || parseInt(this.AdvertisePost.hours, 10) > 48) {
      toggleAlert('할당 시간은 0이거나 48시간을 초과할 수 없습니다.');
      return;
    }
    // 테스트중 주석처리
    if (totalPoint < parseInt(this.AdvertisePost.hours, 10) * 100) {
      toggleAlert('포인트가 충분하지 않습니다.');
      return;
    }

    axios.post('/api/event/advertise', {
      ...this.AdvertisePost,
      userId: userData.id,
    })
      .then((response) => {
        const { data } = response;
        if (data.success) {
          if (data.code === 0) {
            toast.success(data.message);
            this.getAdPostListNow();
          } else {
            toast.info(data.message);
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((response) => console.log(response));
  };

  @action getAdPostList = () => {
    axios.get('/api/event/advertise')
      .then((response) => {
        const { data } = response;
        if (data.success) {
          if (data.code === 0) {
            console.log(data.result);
            this.AdvertisePostList = data.result;
          } else {
            toast.info(data.message);
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((response) => console.log(response));
  };

  @action getAdPostListNow = () => {
    axios.get('/api/event/advertise/now')
      .then((response) => {
        const { data } = response;
        if (data.success) {
          if (data.code === 0) {
            this.AdvertisePostListNow = data.result;
          } else {
            toast.info(data.message);
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((response) => console.log(response));
  };

  @action onChangeAdvertise = (event) => {
    this.AdvertisePost = {
      ...this.AdvertisePost,
      [event.target.name]: event.target.value,
    };
  }
}

export default AdvertiseStore;
