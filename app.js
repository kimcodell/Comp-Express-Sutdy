const fs = require('fs');
const express = require('express');
const path = require('path');
const mysql = require('mysql');

const { sequelize } = require('./models');

sequelize.sync({ force: false })
    .then(() => {
        console.log("DB 연결 성공");
    })
    .catch(console.log);
    
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

//글쓰기 POST 요청
app.post('/post', (req, res) => {
    console.log(req.body);
    connection.query(
        `INSERT INTO COMP.POSTING (title, contents) VALUE ('${req.body.title}', '${req.body.contents}')`
    )
})

//게시글 데이터 요청
app.get('/post-data', (req, res) => {
    connection.query(
        "SELECT * FROM POSTING",
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
        `SELECT * FROM POSTING WHERE ID = ${req.params.id}`,
        (err, rows, fields) => {
            res.send(rows);
        }
    )
})

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