const { createSignature } = require('../utils/jwt')

exports.auth = (req,res,next)=>{
    let cookies = req.headers.cookie
    // console.log(token)
    //토큰을 검증하려면 어떤 로직을 구현해야하는지:
    //1.token의 . 기준으로 내용을 뽑아온다. [header,payload,sign]
    //2.가져온 header와 payload를 가지고 새로운 signature를 만든다.
    //3.새로운 signature와 기존의 sign을 비교해서 같은지 확인.
    // 이때 같으면 성공적인 쿠키 , 다르면 실패한 쿠키이다.
    // 성공적인 쿠키면 req객체에 추가해 내용완성 ,실패한쿠키면 다른곳으로 보낸다.
    try{
    let [[,token]] = cookies.split(';').map(v=>v.trim().split('=')).filter(v=>v[0] == 'AccessToken')
    //1.
    const [header,payload,sign] = token.split('.')
    //2.
    const signature = createSignature(header,payload)
    //3.
    if(signature !== sign) throw new Error('Token error')
    //3-1. payload에 대한 내용을 decoding해서 가져온다(base64 -> Object)
    const user = JSON.parse(Buffer.from(payload,'base64').toString('utf-8'))
    //3-2. req객체에 user를 추가해서 보냈다.
    req.user = {
        ...user
    }
    // console.log(user)

    next()
    }catch(e){
        res.send('토큰을 조작하셨군요!')
        next()
    }
    
}