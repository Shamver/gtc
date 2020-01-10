import HeaderStore from './HeaderStore';
import BoardStore from './BoardStore';
import UtilStore from './UtilStore';
import CategoryStore from './CategoryStore';
import RouteStore from './RouteStore';
import UserStore from './UserStore';

import UserAlertStore from './user/AlertStore';
import UserFavoritePostStore from './user/FavoritePostStore';
import UserIgnoreStore from './user/IgnoreStore';
import UserStore2 from './user/UserStore';

import PostLockerStore from './postlocker/PostLockerStore';

import SettingStore from './setting/SettingStore';

class RootStore {
  constructor() {
    this.HeaderStore = new HeaderStore(this);
    this.BoardStore = new BoardStore(this);
    this.UtilStore = new UtilStore(this);
    this.CategoryStore = new CategoryStore(this);
    this.RouteStore = new RouteStore(this);
    this.UserStore = new UserStore(this);
    this.UserAlertStore = new UserAlertStore(this);
    this.UserFavoritePostStore = new UserFavoritePostStore(this);
    this.UserIgnoreStore = new UserIgnoreStore(this);
    this.UserStore2 = new UserStore2(this);
    this.PostLockerStore = new PostLockerStore(this);
    this.SettingStore = new SettingStore(this);
  }
}

export default new RootStore();
