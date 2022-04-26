
const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const logger = require('morgan');
const ejs = require("ejs");
const LocalStrategy = require("passport-local");
const passport = require('passport');
const flash = require('connect-flash');
const jwt =require("jsonwebtoken");

// link router
const cate = require("./routes/cate.js");
const view_user = require("./routes/view_user.js");
const cart = require("./routes/cart.js");
const detail_notifi = require("./routes/detail-notifi.js");
const notifi = require("./routes/notification.js");
const detail_product = require("./routes/detail-product.js");
const router = require("./routes/users.js")
const product = require('./routes/product.js');
const client = require('./routes/client.js');
const about = require('./routes/about.js');
const contact = require('./routes/contact.js');

//Link models
const products = require("./models/products.model");
config = require('./config/database.js');

const mongoose = require('mongoose');
//connect db
async function connect() {
    try {
        await mongoose.connect(config.url,{ useNewUrlParser: true , useUnifiedTopology: true });
    }
    catch (error) {
        console.error(error.message);
        process.exit(-1);
    }
}
connect().then(() => {
  console.log('Connected to database');
}).catch(err => {
  console.log('Database connection error: ' + err);
});

require('./config/passport'); //vượt qua passport để config trang đăng nhâp/đăng ký
app.use(session({
  secret: 'adsa897adsa98bs',
  resave: false,
  saveUninitialized: false,
}))
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', function(req,res){
  if(!req.session.loggin){
   user =null;
   let perPage = 12; // số lượng sản phẩm xuất hiện trên 1 page
   let page = req.params.page || 1;

   products
     .find() // find tất cả các data
     .sort({ date: "descending" })
     .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
     .limit(perPage)
     .exec((err, data) => {
       products.countDocuments((err, count) => {
         // đếm để tính có bao nhiêu trang
         if (err) return next(err);
         res.render("user/index", {
           danhsach: data,
           
           current: page, // page hiện tại
           pages: Math.ceil(count / perPage),
         }); // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
       });
     });
}else{
  user =req.user;
  let perPage = 12; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1;

  products
    .find() // find tất cả các data
    .sort({ date: "descending" })
    .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, data) => {
      products.countDocuments((err, count) => {
        // đếm để tính có bao nhiêu trang
        if (err) return next(err);
        res.render("user/index", {
          danhsach: data,
       
          current: page, // page hiện tại
          pages: Math.ceil(count / perPage),
        }); // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
      });
    });
}
})

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//get router
app.use("/", detail_notifi);
app.use("/", notifi);
app.use("/", router);
app.use("/", contact);
app.use("/", about);
app.use("/", client);
app.use("/", cart);
app.use("/", view_user);
app.use("/", product);
app.use("/", cate);
app.use("/", detail_product);
// catch 404 and forward to error handler
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{console.log("Server is running on port ", PORT)});

