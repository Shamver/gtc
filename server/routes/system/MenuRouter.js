const express = require('express');

const router = express.Router();
const { info } = require('../../log-config');
const Database = require('../../Database');

const INSERT_MENU = `
  INSERT INTO GTC_MENU (
      ID
      , NAME
      , PATH
      , \`DESC\`
      , \`ORDER\`
      , USE_FL
      , TYPE
      , PERMISSION_LEVEL
      , ICON
  ) VALUES (
      ':MENU_ID'
      , ':NAME'
      , ':PATH'
      , ':DESC'
      , :ORDER
      , :USE_FL
      , ':TYPE'
      , :PERMISSION_LEVEL
      , ':ICON'
  )
`;

const SELECT_MENU = `
  SELECT
    GB.ID AS id
    , GB.NAME AS name
    , GB.PATH AS path
    , GB.\`DESC\` AS \`desc\`
    , GB.\`ORDER\` AS \`order\`
    , GB.ICON AS icon
    , GB.USE_FL AS useFl
    , GB.TYPE AS type
    , GB.PERMISSION_LEVEL AS permissionLevel
    , GB.CRT_DTTM AS crtDttm
   FROM GTC_MENU GB
   WHERE GB.ID = ':MENU_ID'
`;

const SELECT_MENU_ALL = `
  SELECT
    GB.ID AS id
    , GB.NAME AS name
    , GB.PATH AS path
    , GB.\`DESC\` as \`desc\`
    , GB.\`ORDER\` as \`order\`
    , GB.ICON AS icon
    , GB.TYPE AS type
    , (SELECT NAME FROM GTC_CODE WHERE CODEGROUP_ID = 'YN_FLAG' AND CODE = GB.USE_FL) AS useFl
    , GB.PERMISSION_LEVEL AS permissionLevel
    , GB.CRT_DTTM AS crtDttm
   FROM GTC_MENU GB
   ORDER BY GB.\`ORDER\`
`;

const SELECT_MENU_USE_FL_Y = `
  SELECT
    GB.ID AS id
    , GB.NAME AS name
    , GB.PATH AS path
    , GB.\`DESC\` as \`desc\`
    , GB.\`ORDER\` as \`order\`
    , GB.ICON AS icon
    , GB.TYPE AS type
    , (SELECT NAME FROM GTC_CODE WHERE CODEGROUP_ID = 'YN_FLAG' AND CODE = GB.USE_FL) AS useFl
    , GB.PERMISSION_LEVEL AS permissionLevel
    , GB.CRT_DTTM AS crtDttm
   FROM GTC_MENU GB
   WHERE GB.USE_FL = 1
   AND GB.PERMISSION_LEVEL <= :PERMISSION_LEVEL
   ORDER BY GB.\`ORDER\`
`;

const UPDATE_MENU = `
  UPDATE GTC_MENU 
  SET 
    NAME = ':NAME'
    , PATH = ':PATH'
    , \`DESC\` = ':DESC'
    , \`ORDER\` = :ORDER
    , USE_FL = :USE_FL
    , ICON = ':ICON'
    , PERMISSION_LEVEL = :PERMISSION_LEVEL
    , TYPE = ':TYPE'
  WHERE ID = ':MENU_ID'
`;

const DELETE_MENU = `
  DELETE FROM GTC_MENU
  WHERE ID = ':MENU_ID'
`;

const INSERT_MENU_CATEGORY = `
  INSERT INTO GTC_MENU_CATEGORY (
      ID
      , MENU_ID
      , NAME
      , PATH
      , \`DESC\`
      , \`ORDER\`
      , USE_FL
  ) VALUES (
      ':CATEGORY_ID'
      , ':MENU_ID'
      , ':NAME'
      , ':PATH'
      , ':DESC'
      , :ORDER
      , :USE_FL
  )
`;

const SELECT_MENU_CATEGORY = `
  SELECT
    GBC.ID AS id
    , GBC.MENU_ID AS menu
    , GBC.NAME AS name
    , GBC.PATH AS path
    , GBC.\`DESC\` as \`desc\`
    , GBC.\`ORDER\` as \`order\`
    , GBC.USE_FL AS useFl
    , GBC.CRT_DTTM AS crtDttm
   FROM GTC_MENU_CATEGORY GBC
   WHERE 
    GBC.MENU_ID = ':MENU_ID'
    AND GBC.ID = ':CATEGORY_ID'
   ORDER BY GBC.\`ORDER\`
`;

const SELECT_MENU_CATEGORY_USE = `
  SELECT
    GBC.ID AS id
    , GBC.MENU_ID AS menu
    , GBC.NAME AS name
    , GBC.PATH AS path
    , GBC.\`DESC\` as \`desc\`
    , GBC.\`ORDER\` as \`order\`
    , GBC.USE_FL AS useFl
    , GBC.CRT_DTTM AS crtDttm
   FROM GTC_MENU_CATEGORY GBC
   WHERE 
    GBC.MENU_ID = ':MENU_ID'
    AND GBC.USE_FL = 1
   ORDER BY GBC.\`ORDER\`
`;

const SELECT_MENU_CATEGORY_ALL = `
  SELECT
    GBC.ID AS id
    , GBC.MENU_ID AS menu
    , GBC.NAME AS name
    , GBC.PATH AS path
    , GBC.\`DESC\` as \`desc\`
    , GBC.\`ORDER\` as \`order\`
    , (SELECT NAME FROM GTC_CODE WHERE CODEGROUP_ID = 'YN_FLAG' AND CODE = GBC.USE_FL) AS useFl
    , GBC.CRT_DTTM AS crtDttm
   FROM GTC_MENU_CATEGORY GBC
   WHERE GBC.MENU_ID = ':MENU_ID'
   ORDER BY GBC.\`ORDER\`
`;

const UPDATE_MENU_CATEGORY = `
  UPDATE GTC_MENU_CATEGORY 
  SET 
    NAME = ':NAME'
    , PATH = ':PATH'
    , \`DESC\` = ':DESC'
    , \`ORDER\` = :ORDER
    , USE_FL = :USE_FL
  WHERE
    ID = ':CATEGORY_ID'
    AND MENU_ID = ':MENU_ID'
`;

const DELETE_MENU_CATEGORY = `
  DELETE FROM GTC_MENU_CATEGORY
  WHERE 
    MENU_ID = ':MENU_ID'
    AND ID = ':CATEGORY_ID'
`;

router.post('/', (req, res) => {
  const {
    id, name, desc, path, icon,
    order, useFl, permissionLevel,
    type,
  } = req.body;

  Database.execute(
    (database) => database.query(
      INSERT_MENU,
      {
        MENU_ID: id,
        NAME: name,
        DESC: desc,
        PATH: path,
        TYPE: type,
        ORDER: order,
        USE_FL: useFl,
        PERMISSION_LEVEL: permissionLevel,
        ICON: icon,
      },
    )
      .then(() => {
        res.json({
          success: true,
          code: 1,
          message: '😳 메뉴 추가 완료!',
        });
      }),
  ).then(() => {
    info('[INSERT, POST /api/system/menu] 시스템 메뉴 추가');
  });
});

router.get('/', (req, res) => {
  const { id } = req.query;
  Database.execute(
    (database) => database.query(
      SELECT_MENU,
      {
        MENU_ID: id,
      },
    )
      .then((rows) => {
        res.json({
          success: true,
          code: 1,
          message: '메뉴 조회 완료',
          result: rows[0],
        });
      }),
  ).then(() => {
    info('[SELECT, GET /api/system/menu] 메뉴 게시판 조회');
  });
});

router.get('/all', (req, res) => {
  Database.execute(
    (database) => database.query(
      SELECT_MENU_ALL,
    )
      .then((rows) => {
        res.json({
          success: true,
          code: 1,
          message: '메뉴 전체 조회 완료',
          result: rows,
        });
      }),
  ).then(() => {
    info('[SELECT, GET /api/system/menu/all] 시스템 게시판 전체 조회');
  });
});

router.get('/use', (req, res) => {
  const { level } = req.query;
  Database.execute(
    (database) => database.query(
      SELECT_MENU_USE_FL_Y,
      {
        PERMISSION_LEVEL: level,
      },
    )
      .then((rows) => {
        res.json({
          success: true,
          code: 1,
          message: '게시판 사용 조회 완료',
          result: rows,
        });
      }),
  ).then(() => {
    info('[SELECT, GET /api/system/menu/use] 시스템 게시판 사용 조회');
  });
});

router.put('/', (req, res) => {
  const {
    id, name, desc, path, icon,
    order, useFl, permissionLevel,
    type,
  } = req.body;
  Database.execute(
    (database) => database.query(
      UPDATE_MENU,
      {
        MENU_ID: id,
        NAME: name,
        DESC: desc,
        PATH: path,
        ORDER: order,
        USE_FL: useFl,
        PERMISSION_LEVEL: permissionLevel,
        ICON: icon,
        TYPE: type,
      },
    )
      .then((rows) => {
        res.json({
          success: true,
          code: 1,
          message: '😳 메뉴 수정되었습니다!',
          result: rows[0],
        });
      }),
  ).then(() => {
    info('[UPDATE, PUT /api/system/menu] 시스템 메뉴 수정');
  });
});

router.delete('/', (req, res) => {
  const { id } = req.query;
  Database.execute(
    (database) => database.query(
      DELETE_MENU,
      {
        MENU_ID: id,
      },
    )
      .then((rows) => {
        res.json({
          success: true,
          code: 1,
          message: '😳 게시판이 삭제되었습니다!',
          result: rows[0],
        });
      }),
  ).then(() => {
    info('[DELETE, DELETE /api/system/menu] 시스템 게시판 삭제');
  });
});

router.post('/category', (req, res) => {
  const {
    id, menu, name, desc, path,
    order, useFl,
  } = req.body;

  Database.execute(
    (database) => database.query(
      INSERT_MENU_CATEGORY,
      {
        CATEGORY_ID: id,
        MENU_ID: menu,
        NAME: name,
        DESC: desc,
        PATH: path,
        ORDER: order,
        USE_FL: useFl,
      },
    )
      .then(() => {
        res.json({
          success: true,
          code: 1,
          message: '😳 게시판 카테고리 추가 완료!',
        });
      }),
  ).then(() => {
    info('[INSERT, POST /api/system/menu/category] 시스템 게시판 카테고리 추가');
  });
});

router.get('/category', (req, res) => {
  const { menu, category } = req.query;
  Database.execute(
    (database) => database.query(
      SELECT_MENU_CATEGORY,
      {
        MENU_ID: menu,
        CATEGORY_ID: category,
      },
    )
      .then((rows) => {
        res.json({
          success: true,
          code: 1,
          message: '게시판 카테고리 조회 완료',
          result: rows[0],
        });
      }),
  ).then(() => {
    info('[SELECT, GET /api/system/menu/category] 시스템 게시판 카테고리 조회');
  });
});

router.get('/category/all', (req, res) => {
  const { menu } = req.query;
  Database.execute(
    (database) => database.query(
      SELECT_MENU_CATEGORY_ALL,
      {
        MENU_ID: menu,
      },
    )
      .then((rows) => {
        res.json({
          success: true,
          code: 1,
          message: '게시판 카테고리 전체 조회 완료',
          result: rows,
        });
      }),
  ).then(() => {
    info('[SELECT, GET /api/system/menu/category/all] 게시판 카테고리 전체 조회 완료');
  });
});

router.get('/category/use', (req, res) => {
  const { board } = req.query;
  Database.execute(
    (database) => database.query(
      SELECT_MENU_CATEGORY_USE,
      {
        MENU_ID: board,
      },
    )
      .then((rows) => {
        res.json({
          success: true,
          code: 1,
          message: '카테고리 사용 조회 완료',
          result: rows,
        });
      }),
  ).then(() => {
    info('[SELECT, GET /api/system/category/use] 시스템 카테고리 사용 조회');
  });
});

router.put('/category', (req, res) => {
  const {
    menu, id, name, desc, path,
    order, useFl,
  } = req.body;
  Database.execute(
    (database) => database.query(
      UPDATE_MENU_CATEGORY,
      {
        MENU_ID: menu,
        CATEGORY_ID: id,
        NAME: name,
        DESC: desc,
        PATH: path,
        ORDER: order,
        USE_FL: useFl,
      },
    )
      .then((rows) => {
        res.json({
          success: true,
          code: 1,
          message: '😳 카테고리가 수정되었습니다!',
          result: rows[0],
        });
      }),
  ).then(() => {
    info('[UPDATE, PUT /api/system/menu/category] 시스템 게시판 카테고리 수정');
  });
});

router.delete('/category', (req, res) => {
  const { menu, category } = req.query;
  Database.execute(
    (database) => database.query(
      DELETE_MENU_CATEGORY,
      {
        MENU_ID: menu,
        CATEGORY_ID: category,
      },
    )
      .then((rows) => {
        res.json({
          success: true,
          code: 1,
          message: '😳 카테고리가 삭제되었습니다!',
          result: rows[0],
        });
      }),
  ).then(() => {
    info('[DELETE, DELETE /api/system/menu/category] 시스템 게시판 카테고리 삭제');
  });
});

module.exports = router;