import jwt from 'jsonwebtoken';


export default function decodeToken(token, getFullToken = false){
    if(token.includes('Bearer ')) token = token.replace('Bearer ', '');
    const decodedToken = jwt.decode(token, { complete: getFullToken });
    return decodedToken;
}