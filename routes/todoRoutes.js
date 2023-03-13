const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path');
const verify = require('../middlewares/verify');
const Todo = require('../models/todo');
// todos
// create todos
router.post('/',verify,async(req,res)=>{
	const todo = await Todo.create({
		title:req.body.title,
		status:req.body.status || 'todo',
		user: req.user._id
	})

	res.send(todo)

})
// gettodos
router.get('/',verify,async(req,res,next)=>{
		const todos = await Todo.find({user:req.user._id}).populate('user');
		res.send(todos);
})
router.get('/:id',(req,res)=>{})
// update user
router.patch('/:id',(req,res)=>{})
// delete user
router.delete('/:id',(req,res)=>{});


module.exports = router;
