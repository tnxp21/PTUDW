var express = require("express");
const products = require("../models/products.model");
const comments = require("../models/comment.models");
const Cate = require("../models/Cate");
var detail_product = express.Router();


detail_product.get("/user/detail-product/:id",(req,res)=>{

  
  products.findById( req.params.id, function(err,data){
    if(err){

    }else{

      danhsach= data;
      idsp = danhsach._id;
      idcate = danhsach.cateID;
      comments.find( {idsp}).then(function (data) {
        products.find({cateID: idcate} ).limit(4).then(function (item) { 
          res.render("user/Detailproducts",{   
            cmt : data,
            guess : user,
            relate : item,
            idca : idcate,
          });
        });
      });
     
    }
      
    })
   
    });
    // console.log(data)
    // res.render("user/Detailproducts",{   
    //   cmt : data,
    //   guess : user,
detail_product.post("/comment",(req,res)=>{
  if(req.session.loggin){
      user = req.user
 
      var comment = comments({
        uname : user.name,
        idsp : req.body.idsp,
        note : req.body.note,
        ngaygui : Date.now()
      });
      comment.save(function(err,data){
        if(err){
        console.log(err)
        }else{
          res.redirect("/product")
        }
      })
 
}
})



detail_product.get("/delete-comment/:id",(req,res)=>{
    comments.deleteOne( {_id:req.params.id}, function(err){
      if(err){
        res.redirect("/product")
      
      }else{
       
        res.redirect("/product")
  }


  })

 



})

//giỏ hàngrouter.get('/cart',async function (req, res){
  

module.exports = detail_product
