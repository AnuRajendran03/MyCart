const session = require('express-session');
var con = require('../config/config');
let Razorpay = require('../payment/Razorpay');

const getHomePage = (req,res)=>{
    let sql = "select * from product" 
    con.query(sql,(err,row)=>
    {
        console.log(row);
        if(err){
            console.log(err);
        }else{
            if(req.session.user){
                let user = req.session.user;
                let id = user.id;
                console.log(user);
                let cartQry = "select count (*) cartNumber from cart where userid = ?;"
                con.query(cartQry,[id],(err,result)=>
                {
                    if(err){
                        console.log(err);
                    }else{
                        console.log(result[0].cartNumber,"cart");
                        let cart = result[0].cartNumber;
                        res.render('index',{user,row,cart});
                    }
                })
                // res.render('index',{user,row});
            }else
            {
                res.render('index',{row});
            }
        }
    })   
}

const getLoginPage = (req,res)=>{
    res.render('User/Login');
}

const getmyOrder = (req,res)=>{
    let user = req.session.user;
    res.render('User/myOrder',{user});
}

const getRegister = (req,res)=>{
    res.render('User/Register');
}
const doLogin = (req,res)=>
{
let {email} = req.body;
let {password} = req.body;
let check = "select * from user where email =  ? and password = ?" 
con.query(check,[email,password],(err,result)=>{
    if(err){
        console.log(err);  
    }else
    {
      console.log(result);
      if(result.length>0)
      {
        console.log("successfully login");
        req.session.user = result[0];
        console.log(req.session.user,"from session data");
        res.redirect('/')
      }else{
        console.log("invalid user");
        res.redirect('/login')
      }
    }
})
}  

const Logout = (req,res)=>
{
    req.session.destroy()
    res.redirect('/') 
}


const doRegister = (req,res)=>{
    console.log(req.body);
    let qry = "insert into user set ?"
    con.query(qry,req.body,(err,result)=>{
        if(err){
            console.log(err);
        }else
        {
            console.log("value instered");
            res.redirect('/login')
        }
    })  
}

const addtocart = (req,res)=>{
     let productid = req.params.pid;
     let userid = req.session.user.id;
     let query1 = "select * from cart where productid = ? and userid = ?"
     con.query(query1,[productid,userid],(err,result) =>
     {
        if(err)
        {
            con.log(err);
        }else{
            if(result.length>0){
                var qty = result[0].qty;
                let cartID = result[0].id;
                qty = parseInt(qty)+1;
                let query2 = "update cart set qty = ? where id = ?"
                con.query(query2,[qty,cartID],(err,row) =>
                {
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect('/')
                    }
                })
            }else{
                let query3 = "insert into cart set ?"
                let data = {productid,userid}
                con.query(query3,data,(err,result)=>
                {
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect('/')
                    }
                })
            }
        }
     })

}

const singleProduct = (req,res)=>{
    let productId = req.params.id;
    let query4 = "select * from product where id = ?"
    con.query(query4,[productId],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            let Product = result[0]
            let user =req.session.user;
            res.render('User/singlePage',{Product,user})
        }
    })
}

const checkOut = (req,res)=>{
    let pid = req.params.id;
    let price = parseInt(req.params.price);
    console.log(pid,price);
    var options = {
        amount:price,
        currency: "INR",
        receipt: "Order_reptid_11"
    };
    Razorpay.orders.create(options,(err,order)=>{
        if(err){
            console.log(err)
        }else{
            console.log(order)
            res.render('User/checkOut',{order})
            }
            })
        }



     const payVarify = async(req,res)=>{
        console.log(req.body)
        let data = req.body;
        var crypto = require('crypto')
        var order_id = data['response[razorpay_order_id]']
        var payment_id = data[ 'response[razorpay_payment_id]']
        const razorpay_signature = data[ 'response[razorpay_signature]']
        const key_secret = '0dQCoDwMSkITlrqCmlNKuXoG';
        let hmac = crypto.createHmac('sha256', key_secret); 
        await hmac.update(order_id + "|" + payment_id);
        const generated_signature = hmac.digest('hex');
        if(razorpay_signature===generated_signature){
            console.log("Verified");
        }
        else{
            console.log("Failed")
        }

     }




// const doLogin = (req,res)=>{
//     console.log(req.body);
// }
module.exports = {
    getHomePage,
    getLoginPage,
    getRegister,
    doRegister ,
    doLogin,
    getmyOrder,
    addtocart,
    singleProduct,
    checkOut,
    payVarify,
    Logout
}