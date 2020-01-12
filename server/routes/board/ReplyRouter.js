const express = require('express');

const router = express.Router();

const db = require('../../dbConnection')();

const conn = db.init();

router.post('/', (req, res) => {
  const data = req.body;
  const query = `INSERT INTO GTC_BOARD_REPLY (
      ID,
      BP_ID,
      ID_REPLY,
      ID_UPPER,
      WRITER,
      DATE,
      UPDATE_DATE,
      CONTENT,
      DEPTH
    ) VALUES (
      (SELECT ID FROM (SELECT IFNULL(MAX(ID)+1,1) AS ID FROM GTC_BOARD_REPLY) as temp),
      ${data.bpId},
      IFNULL(${data.replyId}, (SELECT ID FROM (SELECT IFNULL(MAX(ID)+1,1) AS ID FROM GTC_BOARD_REPLY) as temp)),
      IFNULL((SELECT ID_UPPER FROM (SELECT MIN(ID_UPPER) AS ID_UPPER FROM GTC_BOARD_REPLY WHERE ID = ${data.replyId}) as temp),(SELECT ID FROM (SELECT IFNULL(MAX(ID)+1,1) AS ID FROM GTC_BOARD_REPLY) as temp)),
      '${data.writer}', 
      sysdate(),
      null, 
      '${data.text}',
      ${data.depth}
    );
  `;

  conn.query(query, (err) => {
    if (err) throw err;
    res.send(true);
  });
});

router.get('/', (req, res) => {
  const data = req.query;
  const query = `SELECT 
    A.ID AS id
    , A.ID_REPLY AS idReply
    , A.ID_UPPER AS idUpper
    , C.WRITER AS idPostWriter
    , A.WRITER AS idWriter
    , (SELECT U.NICKNAME FROM GTC_USER U WHERE U.ID = A.WRITER) AS writer
    , CASE WHEN A.DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 MINUTE),'%Y-%m-%d %H:%i:%s') THEN '몇 초 전'
        WHEN A.DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 HOUR),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(MINUTE,A.DATE, SYSDATE()),'분 전')
        WHEN A.DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 DAY),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(HOUR,A.DATE, SYSDATE()),'시간 전')
        WHEN A.DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 MONTH),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(DAY,A.DATE, SYSDATE()),'일 전')
        WHEN A.DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 YEAR),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(MONTH,A.DATE, SYSDATE()),'달 전')
       ELSE CONCAT(TIMESTAMPDIFF(YEAR,A.DATE, SYSDATE()),'년 전')
    END  as date
    , CASE
            WHEN A.UPDATE_DATE IS NULL THEN NULL 
            WHEN A.UPDATE_DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 MINUTE),'%Y-%m-%d %H:%i:%s') THEN '몇 초 전 수정'
            WHEN A.UPDATE_DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 HOUR),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(MINUTE,A.UPDATE_DATE, SYSDATE()),'분 전 수정')
            WHEN A.UPDATE_DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 DAY),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(HOUR,A.UPDATE_DATE, SYSDATE()),'시간 전 수정')
            WHEN A.UPDATE_DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 MONTH),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(DAY,A.UPDATE_DATE, SYSDATE()),'일 전 수정')
            WHEN A.UPDATE_DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 YEAR),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(MONTH,A.UPDATE_DATE, SYSDATE()),'달 전 수정')
           ELSE CONCAT(TIMESTAMPDIFF(YEAR, A.UPDATE_DATE, SYSDATE()),'년 전')
       END  as updateDate
    , ( 
        SELECT 
                CASE WHEN MIN(DEPTH) IS NULL THEN 'DELETED'
                        WHEN DEPTH = 2 THEN  (SELECT U.NICKNAME FROM GTC_USER U WHERE U.ID = WRITER) 
                END 
        FROM GTC_BOARD_REPLY
        WHERE ID = A.ID_REPLY
    ) AS replyWriterName
    , A.CONTENT as content
    , A.DEPTH as depth
    , (SELECT COUNT(*) FROM GTC_BOARD_REPLY_LIKE WHERE ID = A.ID) AS likeCount
    FROM GTC_BOARD_REPLY A, GTC_BOARD_POST C
  WHERE A.BP_ID = '${data.bpId}'
  AND C.ID = A.BP_ID
  ORDER BY A.ID_UPPER, A.ID`;

  conn.query(query, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

router.put('/', (req, res) => {
  const data = req.body;
  const query = `UPDATE GTC_BOARD_REPLY
    SET CONTENT = '${data.content}',
    UPDATE_DATE = sysdate()
  WHERE ID = ${data.id}`;

  conn.query(query, (err) => {
    if (err) throw err;
    res.send(true);
  });
});

router.delete('/', (req, res) => {
  const data = req.query;
  const query = `DELETE FROM GTC_BOARD_REPLY
        WHERE ID = ${data.id}`;

  conn.query(query, (err) => {
    if (err) throw err;
    res.send(true);
  });
});

// 댓글 좋아요
router.post('/like', (req, res) => {
  const data = req.body;
  let query = `SELECT COUNT(*) AS count FROM GTC_BOARD_REPLY_LIKE
    WHERE ID=${data.id}
    AND U_ID=${data.uId}`;
  conn.query(query, (err, rows) => {
    if (err) throw err;

    // 이미 해당 댓글에 해당 유저가 좋아요를 누름.
    if (rows[0].count === 1) {
      res.send(2);
    } else {
      query = `INSERT INTO GTC_BOARD_REPLY_LIKE
        VALUES (
          ${data.id},
          ${data.uId}
        )`;

      conn.query(query, (err2) => {
        if (err2) throw err2;

        res.send(1);
      });
    }
  });
});


module.exports = router;
