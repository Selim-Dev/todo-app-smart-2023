const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../models/user');
const {jwtSecret} = require('../config')

const verifyJwt = promisify(jwt.verify);
module.exports = async (req,res,next)=>{
	try{
		//  extract token from headers
		const token = req.headers.authorization;
		if(!token){
			const error = new Error('unauthorized');
			error.statusCode = 401;
			return next(error)
		}
		//  verify the token (secret)
		const {id} = await verifyJwt(token,jwtSecret);
		// find user by id
		const user = await User.findById(id);
		if(!user){
			const error = new Error('unauthorized');
			error.statusCode = 401;
			return next(error)
		}
		//  attach user to request body
		req.user = user;
		next();	
	}catch(err){
		console.log(err)
		next(err)
	}
}
