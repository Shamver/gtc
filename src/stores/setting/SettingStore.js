import { observable, action } from 'mobx';

class SettingStore {
  @observable activeTab = 'ignore';

  @observable withdrawalIsChecked = false;

  constructor(root) {
    this.root = root;
  }

  @action onActive = ((e) => {
    const { name } = e.target;

    if (this.activeTab !== name) {
      this.activeTab = name;
    }
  });

  @action onChangeFavorite = ((e) => {
    const { name } = e.target;

    this.favoriteList = this.favoriteList.map(
      (data) => (data.id === Number.parseInt(name, 10)
        ? { ...data, checked: !data.checked }
        : data),
    );
  });

  @action onClickWithdrawal = (() => {
    this.withdrawalIsChecked = !this.withdrawalIsChecked;
  })

  @action isCheckedWithdrawal = ((next) => {
    if (this.withdrawalIsChecked) {
      next();
    } else {
      this.root.UtilStore.toggleAlert('내용 확인란에 체크를 해주셔야 합니다.');
    }
  });
}

export default SettingStore;
