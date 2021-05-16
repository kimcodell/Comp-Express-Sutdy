const fs = require('fs');
const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();

const databaseInfo = fs.readFileSync('./databaseInfo.json');
const config = JSON.parse(databaseInfo);

const connection = mysql.createConnection({
    host : config.host,
    user : config.user,
    password : config.password,
    port : config.port,
    database : config.database,
});
connection.connect();

//포트 세팅
app.set('port', process.env.PORT || 8080);

// app.use('/client', express.static(path.join(__dirname, 'client')));
app.use(express.json());
app.use(express.urlencoded({extended: true}))   //form 데이터 처리

//메인 페이지 (게시글 리스트)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/list.html'));
})

//글쓰기 페이지
app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, './client/post.html'))
})

//수정 페이지
app.get('/update/:id', (req, res) => {
    res.sendFile(path.join(__dirname, './client/post.html'))
})

//글쓰기 POST 요청
app.post('/post', (req, res) => {
    console.log(req.body);
    connection.query(
        `INSERT INTO COMP.POSTING (title, contents) VALUE ('${req.body.title}', '${req.body.contents}')`
    )
    res.sendFile(path.join(__dirname, './client/list.html'));
})

//게시글 데이터 요청
app.get('/post-data', (req, res) => {
    connection.query(
        "SELECT * FROM POSTING WHERE DELETED = 0 ORDER BY ID DESC",
        (err, rows, fields) => {
            res.send(rows);
        }
    )
})

//게시글 상세페이지 요청
app.get('/detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, './client/detail.html'))
})

//각각의 상세 내용 데이터 요청
app.get('/detail-data/:id', (req, res) => {
    connection.query(
        `SELECT * FROM COMP.POSTING as p left outer join COMP.COMMENT as c on p.Id = c.post_id where p.id = ${req.params.id} and p.deleted = 0`,
        // `SELECT * FROM POSTING left outer join comment WHERE posting.ID = ${req.params.id} AND DELETED = 0`,
        (err, rows, fields) => {
            res.send(rows);
        }
    )
})

//댓글 추가
app.post('/post-comment/:id', (req, res) => {
    connection.query(
        `INSERT INTO COMP.COMMENT (POST_ID, COMMENTS) VALUE ('${req.params.id}', '${req.body.comment}')`
    )
})

//댓글 수정


//댓글 삭제



//게시글 수정
app.put('/update/:id', (req, res) => {
    connection.query(
        `UPDATE COMP.POSTING SET TITLE = "${req.body.title}", CONTENTS = "${req.body.contents}" WHERE id = ${req.params.id}`
    )
    res.sendFile(path.join(__dirname, './client/list.html'));
})
    
//soft delete
app.delete('/:id', (req, res) => {
    connection.query(
        `UPDATE COMP.POSTING SET DELETED = 1 WHERE id = ${req.params.id}`
    )
    res.sendFile(path.join(__dirname, './client/list.html'))
})
        
//완전히 delete
// app.delete('/:id', (req, res) => {
//     connection.query(
//         `DELETE FROM COMP.COMMENTS WHERE POST_ID = ${req.params.id}
//         DELETE FROM COMP.POSTING WHERE id = ${req.params.id}`
//     )
// })
                
//js 파일 등 기타 파일 전송
app.get('/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, `./client/${req.params.filename}`))
})
                
                
//에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.log(err);
    res.send("서버 요청 중 오류가 발생했습니다.")
})


app.listen(app.get('port'), () => {
    console.log("Express 서버 실행 중...")
})