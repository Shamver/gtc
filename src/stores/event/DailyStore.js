import { observable, action } from 'mobx';
import axios from 'axios';
import { toast } from 'react-toastify';

class DailyStore {
  @observable message = '';

  @observable dailyList = [];

  @observable dailyLast = '';

  constructor(root) {
    this.root = root;
  }

  @action getDailyList = (() => {
    axios.get('/api/event/daily')
      .then((response) => {
        if (response.data) {
          this.dailyList = response.data;
        }
      })
      .catch((response) => {
        console.log(response);
      });
  });

  @action getDailyLast = (() => {
    const { userData } = this.root.UserStore;
    axios.get('/api/event/daily/last', {
      params: {
        userId: userData.id,
      },
    })
      .then((response) => {
        const { data } = response;
        console.log(data);
        this.dailyLast = {
          ...data[0],
        };
      })
      .catch((response) => console.log(response));
  });

  @action addDaily = (() => {
    const { userData } = this.root.UserStore;

    if (userData) {
      axios.post('/api/event/daily', {
        params: {
          userId: userData.id,
          message: this.message,
        },
      })
        .then((response) => {
          const { data } = response;
          if (data.SUCCESS) {
            this.getDailyLast();
            this.getDailyList();
            this.message = '';
            toast.success(data.MESSAGE);
          } else {
            toast.error(data.MESSAGE);
          }
        })
        .catch((response) => {
          console.log(response);
        });
    }
  });

  @action onChangeValue = ((e) => {
    this.message = e.target.value;
  });
}

export default DailyStore;