import { action, observable } from 'mobx';
import axios from 'axios';
import { toast } from 'react-toastify';

class BoardStore {
  @observable boardKinds = {};

  @observable boardList = [];

  @observable boardCategoryKinds = {};

  @observable boardCategoryList = [];

  @observable currentBoardPath = '';

  @observable currentBoardName = '';

  @observable currentBoardPage = 1;

  @observable isPagination = false;

  @observable searchInfo = {
    isSearch: false,
    target: '',
    keyword: '',
  };

  constructor(root) {
    this.root = root;
  }

  @action goPost = () => {
    const
  }

  @action setBoardList = () => {
    const { menuList } = this.root.SystemMenuStore;
    this.boardList = menuList.filter((data) => (data.type === 'MT01' && data.id !== 'ALL'));
  }


  @action setBoardKinds = (arr) => {
    this.boardKinds = {};
    for (let i = 0; i < arr.length; i += 1) {
      this.boardKinds[arr[i].path.replace('/', '')] = arr[i].name;
    }
  }

  @action setBoardCategoryKinds = (arr) => {
    this.boardCategoryKinds = {};
    for (let i = 0; i < arr.length; i += 1) {
      this.boardCategoryKinds[arr[i].path.replace('/', '')] = arr[i].name;
    }
  }

  @action setIsPagination = (isPagination) => {
    this.isPagination = isPagination;
  };

  @action setCurrentBoardPage = (currentBoardPage) => {
    this.currentBoardPage = currentBoardPage;
  };

  @action setCurrentBoardPath = (path) => {
    this.currentBoardPath = path;
    this.currentBoardName = this.boardKinds[path];
  };

  @action setCurrentBoardToId = (id) => {
    axios.get('/api/board', { params: { id } })
      .then((response) => {
        const { data } = response;
        if (data.success) {
          if (data.code === 1) {
            this.currentBoard = data.result;
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((response) => { toast.error(response.message); });
  };

  @action getBoardCategoryList = (board, category) => {
    axios.get('/api/system/menu/category/use', {
      params: {
        board,
      },
    })
      .then((response) => {
        const { data } = response;
        if (data.success) {
          if (data.code === 1) {
            this.boardCategoryList = data.result;
            this.setBoardCategoryKinds(data.result);

            // Posting에서 카테고리를 조회하기 때문에 해당 메소드는 게시판에서 카테고리 로드시에만 사용.
            if (category) {
              this.boardPathCheck(board, category);
            }
          }
        } else {
          toast.error(data.message);
        }
      })
      .catch((response) => { toast.error(response.message); });
  };

  @action moveBoard = (path) => {
    this.root.UtilRouteStore.history.setCurrentBoardToId('/'.concat(path.toLowerCase()));
  };

  @action boardPathCheck = (board, category) => {
    const { history } = this.root.UtilRouteStore;
    if (!this.boardKinds[board]) {
      toast.warn('😳 존재하지 않는 게시판입니다.');
      history.push('/');
    }

    if (category && !this.boardCategoryKinds[category]) {
      toast.warn('😳 존재하지 않는 게시판 카테고리입니다.');
      history.push('/');
    }
  };

  @action onSubmit = (e) => {
    if (e.key === 'Enter') {
      this.onSearch();
    }
  };

  @action onSearch = () => {
    const { search } = this.root.BoardPostStore;

    if (this.searchKeyword.length < 2) {
      toast.error('❗ 검색어는 2자 이상 입력해주세요.');
      return;
    }

    this.searchMode = true;
    search();
  };

  @action onChangeTarget = (e) => {
    this.searchTarget = e.target.value;
  };

  @action onChange = (e) => {
    this.searchKeyword = e.target.value;
  };

  @action setKeywordDefault = () => {
    this.searchKeyword = '';
  }
}

export default BoardStore;
