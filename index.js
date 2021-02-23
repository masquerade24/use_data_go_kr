const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const hbs = require('hbs');

const bodyParser = require('body-parser');
const airdata = require('./utils/airdata');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

const publicDir = path.join(__dirname, './public');
const viewsPath = path.join(__dirname, './templates/views'); // templates 안에 views가 있다.
const partialsPath = path.join(__dirname, './templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDir)); // 익스프레스한테 스태틱파일이 여기에 있다고 알려줌

app.get('/', (req, res) => { 
    res.render('index', {
        제목: '미세먼지 정보 앱',
        이름: '김대준',
        이메일: 'ewr1029@naver.com',
    });
});
app.get('/help', (req, res) => { 
    res.render('help', {
        제목: '미세먼지 정보 앱',
        이름: '도우미',
        이메일: 'ewr1029@daum.net',
        메시지: '미세먼지 정보에 관한 앱'
    });
});
app.get('/about', (req, res) => {
    res.render('about', {
        제목: '미세먼지 정보 앱',
        이름: '김대준',
        이메일: 'ewr1029@naver.com',
    });
});
app.post('/air', (req, res) => { // POST로 해야함.
    airdata(req.body.location, (error, {air}={}) => {
        if (error) {
            return res.send({error});
        }
        return res.render('air', {
            제목: '미세먼지 정보',
            이름: '김대준',
            이메일: 'ewr1029@naver.com',
            location: air['parm']['stationName'],
            time: air['list'][0]['dataTime'],
            pm10: air['list'][0]['pm10Value'],
            pm25: air['list'][0]['pm25Value'],
        })
    })
});

app.listen(port, () => {
    console.log(`Server is up and running at port ${port}`);
});