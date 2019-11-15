import { action, observable } from 'mobx';
import axios from 'axios';
import UtilStore from './UtilStore';
import RouteStore from './RouteStore';

class ContentStore {
  @observable post = {
    title: '',
    text: '',
  };

  @action addPost = () => {
    axios.post('api/addPost', {
      board: 'FREE',
      category: 'ALL',
      title: this.post.title,
      writer: 'admin',
      content: this.post.text,
      depth: 1,
    })
      .then((response) => {
        if (response.data) {
          RouteStore.history.push('/tempBoard');
          console.log(RouteStore.match);
          UtilStore.toggleAlert('글이 정상적으로 등록되었습니다.');
          this.post = {
            title: '',
            text: '',
          };
        }
      })
      .catch((response) => { console.log(response); });
  };

  @action onChangeValue = (event) => {
    if (typeof event === 'string') {
      this.post = {
        ...this.post,
        text: event,
      };
    } else {
      this.post = {
        ...this.post,
        [event.target.name]: event.target.value,
      };
    }
  }
}

export default new ContentStore();
