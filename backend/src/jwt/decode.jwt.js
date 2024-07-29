import jwt from 'jsonwebtoken';


export default function decodeToken(token, getFullToken = false){
    const decodedToken = jwt.decode(token, { complete: getFullToken });
    return decodedToken;
}