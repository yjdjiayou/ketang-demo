let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let cors = require('cors');
let MongoStore = require('connect-mongo')(session);
let { User, Slider, Lesson } = require('./db');
let { url } = require('./settings');
let multer = require('multer');
let path = require('path');
let upload = multer({ dest: path.join(__dirname, 'public') });
let { md5 } = require('./utils');
let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    cors({
        origin: ["http://localhost:8080", "http://localhost:8081"],
        credentials: true,//是否允许跨域 发cookie
        allowedHeaders: "Content-Type,x-requested-with",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    })
);
app.use(function (req, res, next) {
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'zhufeng',
    store: new MongoStore({ url })
}));
app.use(function (req, res, next) {
    res.success = function (data) {
        res.json({ code: 0, data });
    }
    res.error = function (error) {
        res.json({ code: 1, error });
    }
    next();
});
app.post('/uploadAvatar', upload.single('avatar'), async (req, res) => {
    let avatar = `http://localhost:9000/${req.file.filename}`;
    await User.updateOne({ _id: req.body.userId }, { avatar });
    if (req.session.user) {
        req.session.user.avatar = avatar;
    }
    res.success(avatar);
});
app.post('/register', async (req, res) => {
    let user = req.body;
    user.avatar = `https://secure.gravatar.com/avatar/${md5(user.email)}?s=48`;
    let result = await User.create(user);
    res.success(result);
});
app.post('/login', async (req, res) => {
    let query = req.body;//{username,password}
    let user = await User.findOne(query);
    if (user) {
        //setTimeout(() => {
        req.session.user = user;
        res.json({
            code: 0,
            data: user
        });
        // }, 3000);
    } else {
        res.json({
            code: 1,
            error: '用户登录失败'
        });
    }
});
//验证用户是否登录
app.get('/validate', async (req, res) => {
    if (req.session.user) {
        res.json({
            code: 0, data: req.session.user
        });
    } else {
        res.json({
            code: 1,
            error: '此用户尚未登录'
        });
    }
});
app.get('/logout', async (req, res) => {
    req.session.user = null;
    res.success('退出登录成功');
});
app.get('/getSliders', async (req, res) => {
    let sliders = await Slider.find();
    res.success(sliders);
});
app.get('/getLessons', async (req, res) => {
    let { category = 'all', offset = 0, limit = 5 } = req.query;
    offset = parseInt(offset);
    limit = parseInt(limit)
    let query = {};
    if (category != 'all') {
        query['category'] = category;
    }
    let list = await Lesson.find(query).sort({ order: 1 }).skip(offset).limit(limit);
    let total = await Lesson.count(query);
    console.log(offset, list.length, total);

    //0+5  5    10+5 16
    let hasMore = (offset + list.length) < total;
    setTimeout(() => {
        res.success({ list, hasMore });
    }, 2000);
});
app.get('/getLesson/:id', async (req, res) => {
    let lesson = await Lesson.findById(req.params.id);
    res.success(lesson);
});
app.listen(9000);