const express = require('express')
const nunjucks = require('nunjucks')
const {user} = require('./models/user')
const { createToken } = require('./utils/jwt')
const { auth } = require('./middlewares/auth')
const app = express()

app.set('view engine','html')
nunjucks.configure('views',{
    express:app,
    watch:true, //nodemon 사용하기위해서 npm install chokidar
})

app.use(express.urlencoded({extended:true,})) // http body 영역을 해석해주는 아이 Content-type : application/x-www-form-urlencoded 일때.
app.use(auth)

app.get('/',(req,res)=>{
    res.send('hello server')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',(req,res)=>{
    const {userid,userpw} = req.body
    const [item] = user.filter(v=>v.userid == userid && v.userpw == userpw)

    try{
        if(item === undefined) throw new Error('item undefined')
        //로그인에 대한 처리부분
        //로그인이 성공적으로 되어야함/
        // 1.jwt 토큰생성
        //      jwt토큰을 생성하기위해서 필요한 값이 무엇일까? -> payload에 해당되는 값(object)
        //      객체 필요하구나!
        //      jwt 토큰을 만드는 함수를 만들자! utils폴더
        const payload = {
            userid:item.userid,
            username:item.username,
            level:1
        }
        const token = createToken(payload)
        // console.log(token)
        //jwt 토큰이 잘 만들어졌는지 확인->jwt.io에 들어가서 검증

        // 2.생성한 토큰을 쿠키로생성해서 보내주어야한다.
        res.setHeader('Set-cookie',`AccessToken=${token}; HttpOnly; Secure; Path=/;`)
        res.redirect('/')
    }catch(e){
        res.send('실패')
    }
    //try,catch문 : try에 에러가 떴을때도 에러가없을때까지 실행은 하되 에러부분을 catch로 넘겨준다.

    // res.status(200).send('도착~') 
    //status(200)은 원래 내재되어있어 안써도 똑같다.여기서알수있는것은 status는 필수값이라는것이다.
    //request message HTTP
    //response message HTTP 200 OK http/1.1
    //보통 200 , 404 , 500 등 사용한다 자세한내용은 응답상태코드 검색 ㄱㄱ~
})

app.get('/user',(req,res)=>{
    res.render('index')
})

app.get('/admin',(req,res)=>{
    // console.log(req.user)
    res.send('하하하하')
})

app.listen(3000,()=>{
    console.log('서버시작')
})


//nodemon : 코드를 수정하면 서버를 자동으로 restart 해준다.
//npm install -g nodemon