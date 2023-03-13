const express = require('express');
require('express-async-errors');
const {port} = require('./config');
const cors = require('cors')
const fs = require('fs')
const app = express();
const test = require('./test')
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes')
const todoRoutes = require('./routes/todoRoutes');
require('./db')
app.use(morgan('combined'));
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
// hide some properties  (password,__v)
// error handling middleware
// try, catch 
// environment variables


app.use('/user',userRoutes)
app.use('/todo',todoRoutes)


app.listen(port,()=>{
	console.log(`Server is running on port ${port}`);
})

// 4 parameters error handler
app.use((err,req,res,next)=>{
	err.statusCode = err.statusCode || 500;
	console.log('from error handler');
	res.status(err.statusCode).json({
		status: 'error',
		message:err.message || 'something went wrong',
		err
	})
});

