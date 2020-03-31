const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const db = require('../../dbConnection')();
const authMiddleware = require('../../middleware/auth');

const conn = db.init();

const { error, info } = require('../../log-config');
const Database = require('../../Database');

const SELECT_USER_FROM_TEL_EMAIL = `
  SELECT COUNT(*) AS count FROM GTC_USER
  WHERE TEL=':TEL'
  or EMAIL=':EMAIL'
`;

const INSERT_NEW_USER = `
  INSERT INTO GTC_USER VALUES(
  (SELECT * FROM (SELECT IFNULL(MAX(ID)+1,1) FROM GTC_USER) as temp),
  ':EMAIL',
  ':NAME',
  ':NICKNAME',
  ':TEL',
  ':BIRTH',
  ':GENDER',
  ':GT_NICKNAME',
  sysdate(),
  null,
  'Y'
  )
`;

const SELECT_USER_FROM_EMAIL = `
  SELECT 
  ID AS id
  , EMAIL AS email
  , NAME AS name
  , GT_NICKNAME AS gtNickname
  , NICKNAME AS nickname 
  , TEL AS tel
  , date_format(BIRTH, '%Y-%m-%d') AS birth
  , GENDER AS gender
  , PROFILE_YN AS profileYN
  , DELETED_DATE AS deletedDate
  FROM GTC_USER
  WHERE EMAIL=':EMAIL'
`;

router.post('/register', (req, res) => {
  const {
    tel, email, nickname, name, birth, gender, gtNickname,
  } = req.body;

  Database.execute(
    (database) => database.query(
      SELECT_USER_FROM_TEL_EMAIL,
      {
        TEL: tel,
        EMAIL: email,
      },
    )
      .then((rows) => {
        if (rows[0].count && rows[0].count >= 1) {
          res.json({
            SUCCESS: true,
            CODE: 2,
            MESSAGE: '동일한 명의나 카카오 계정으로 이미 계정이 생성되어있습니다.',
            DATA: rows,
          });
          throw new Error('동일한 명의나 카카오 계정으로 이미 계정이 생성되어있습니다.');
        } else {
          return database.query(
            INSERT_NEW_USER,
            {
              TEL: tel,
              EMAIL: email,
              NICKNAME: nickname,
              NAME: name,
              BIRTH: birth,
              GENDER: gender.toUpperCase(),
              GT_NICKNAME: gtNickname,
            },
          );
        }
      })
      .then(() => {
        res.json({
          SUCCESS: true,
          CODE: 1,
          MESSAGE: '가입이 완료되었습니다.',
        });
      }),
  ).then(() => {
    // 한 DB 트랜잭션이 끝나고 하고 싶은 짓.
    info('[INSERT, POST /api/user/register] 유저 회원가입');
  }).catch((err) => {
    // 트랜잭션 중 에러가 났을때 처리.
    error(err.message);

    // Database 에서 보여주는 에러 메시지
    if (err.sqlMessage) {
      error(err.sqlMessage);
    }

    // 실행된 sql
    if (err.sql) {
      error(err.sql);
    }
  });
});

router.post('/login', (req, res) => {
  const data = req.body;
  const secret = req.app.get('jwt-secret');

  Database.execute(
    (database) => database.query(
      SELECT_USER_FROM_EMAIL,
      {
        EMAIL: data.email,
      },
    )
      .then((rows) => {
        if (rows.length === 1) {
          const resultData = rows[0];
          const {
            id, nickname, gtNickname, deletedDate, email, tel, birth, gender, profileYN, name,
          } = resultData;

          if (deletedDate === null) {
            jwt.sign(
              {
                id,
                name,
                username: nickname,
                gtName: gtNickname,
                email,
                tel,
                birth,
                gender,
                profileYN,
              },
              secret,
              {
                expiresIn: '1d',
                issuer: 'GTC',
                subject: 'userInfo',
              }, (err2, token) => {
                if (err2) throw (err2);
                res.cookie('authToken', token, { httpOnly: true });
                res.json({
                  SUCCESS: true,
                  CODE: 1,
                  MESSAGE: '😊 로그인 완료!',
                });
              },
            );
          } else {
            res.json({
              SUCCESS: true,
              CODE: 2,
              MESSAGE: '해당 아이디는 회원탈퇴 상태입니다.\n탈퇴일로부터 30일이 지난 후에 재가입해주세요.',
            });
          }
        } else {
          res.json({
            SUCCESS: true,
            CODE: 3,
            MESSAGE: '해당 이메일로 가입된 계정이 존재하지 않습니다.\n회원가입 후 진행해주세요.',
          });
        }
      }),
  ).then(() => {
    // 한 DB 트랜잭션이 끝나고 하고 싶은 짓.
    info('[SELECT, POST /api/user/login] 유저 로그인');
  }).catch((err) => {
    // 트랜잭션 중 에러가 났을때 처리.
    error(err.message);

    // Database 에서 보여주는 에러 메시지
    if (err.sqlMessage) {
      error(err.sqlMessage);
    }

    // 실행된 sql
    if (err.sql) {
      error(err.sql);
    }
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({
    SUCCESS: true,
    CODE: 1,
    MESSAGE: '😊 로그아웃 완료!',
  });
});

router.use('/check', authMiddleware);
router.get('/check', (req, res) => {
  res.json({
    SUCCESS: true,
    CODE: 1,
    MESSAGE: '토큰 체크 완료',
    DATA: req.decoded,
  });
});

module.exports = router;
