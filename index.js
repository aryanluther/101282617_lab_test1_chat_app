const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoute');

const app = express();
app.use(express.json()); // Make sure it comes back as json

//TODO - Replace you Connection String here
mongoose.connect('mongodb+srv://aryan:lucifer@cluster0.sw9nz.mongodb.net/user?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(userRouter);

app.listen(8081, () => { console.log('Server is running...') });