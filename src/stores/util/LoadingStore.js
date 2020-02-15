import { observable, action } from 'mobx';

class LoadingStore {
  @observable loading = true;

  constructor(root) {
    this.root = root;
  }

  @action doLoading = () => {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 250);
  };
}

export default LoadingStore;