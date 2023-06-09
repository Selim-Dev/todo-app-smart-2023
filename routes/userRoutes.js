const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const validator = require('../middlewares/validators');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const verify = require('../middlewares/verify');
const CustomError = require('../helpers/customError');
const signJwt = promisify(jwt.sign);
const {jwtSecret} = require('../config')
//problems//
//1 ) duplication try,catch
//2) duplication error handling
// 3) after login how to know the user
// 4) better modularizatio0n for pasword helpers


// users
const checkRequiredFields = (params)=>(req,res,next)=>{
	const receivedParams = Object.keys(req.body);
	const missingParams = params.filter(param=>!receivedParams.includes(param))
	if(missingParams.length)throw new CustomError(`missing params ${missingParams.join(',')}`,400)

}

// create users
router.post('/',async(req,res,next)=>{
	const {username,age,password} = req.body;
		const createdUser = new User({
			username,
			age,
			password
		})
		await createdUser.save()
		res.send(createdUser);

})
const asyncWrapper = (asyncFunc)=>async(req,res,next)=>{
	try{
		await asyncFunc(req,res,next);
	}catch (err){
		return next(err)
	}
}

router.post('/login',validator.validateSignin,async (req,res,next)=>{
	const {username,password} = req.body;
		const user  = await User.findOne({username});
		if(!user) throw new CustomError('invalid credentials',400);
		const isMatch = await user.comparePassword(password);
		if(!isMatch) throw new CustomError('invalid credentials',400);
		// create token 
		const payload = {id:user._id}
		const token = await signJwt(payload,jwtSecret,{expiresIn:'1h'}) // kdlsfjasklfds.
		// send to client
		res.json({
			message:'logged in',
			token,
			user
		})
})

router.get('/profile',verify,async (req,res,next)=>{
	res.send({user:req.user})
})
// getUsers
router.get('/',verify,async(req,res,next)=>{
		const users = await User.find();
		res.send(users);
})
// update user
// paramse {}
router.patch('/:id', async(req,res)=>{
	try{
		const updatedUser = await User.findByIdAndUpdate("req.params.id",req.body,{new:true});
		res.send(updatedUser);
	}catch (err){
		console.log(err)
		return next(err)
	}
})
// delete user
router.delete('/:id',(req,res)=>{})


module.exports = router;