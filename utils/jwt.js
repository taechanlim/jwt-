//HASH
const crypto = require('crypto')
const salt = 'ingoo' //(원래 .env파일에 넣어야함)
function createToken(state){
    //jwt에 필요한 필수요소 :  header , payload , signature
    const header = {
        typ:"JWT",
        alg:"HS256"
    }
    const payload = {
        ...state
    }

    const encodingHeader = encoding(header)
    const encodingPayload = encoding(payload)
    const signature = createSignature(encodingHeader,encodingPayload)

    return `${encodingHeader}.${encodingPayload}.${signature}`
}

function encoding(value){
    return Buffer.from(JSON.stringify(value)).toString('base64').replace(/[=]/g,'')
}

//encoding한 header와 encoding한 payload 값을 가지고 sha-256을 만든다.
//만들때 salt도 뿌려줘야하고 그 값을 base64로 encoding을 해준다.
function createSignature(header,payload){
    let encoding = `${header}.${payload}`
    const signature = crypto.createHmac('sha256',salt)
                            .update(encoding)
                            .digest('base64')
                            .replace(/[=]/g,'')
    return signature
}

module.exports = {
    createToken,
    createSignature
}