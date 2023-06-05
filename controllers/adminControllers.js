var con = require('../config/config')

const getadminlogin = (req,res)=>
{
    res.render('admin/Login');
}

const login = (req,res)=>
{
 let username = "admin";
 let password = "admin";
 console.log(req.body)
 if
 (req.body.username == username && req.body.password == password)
 {
    console.log("login successfully");
    res.render('admin/adminHome');
 }else
 {
    console.log("failed");
    res.redirect('/admin');
 }
}

const adminHome = (req,res)=>
{
    res.render('admin/adminHome');
}

const addProductpage = (req,res)=>
{
    res.render('admin/addProduct');
}

const addProduct = (req,res)=>
{
    let file = req.files.image;
    const {name} = req.files.image;
    req.body.image = name;
    console.log(req.body);
    var data = req.body;
    file.mv('public/images/product/'+name,(err)=>{
        if(err){
            console.log(err);
        }else{
            let sql = "insert into product set ?"
            con.query(sql,data,(err,row)=>
            {
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/admin/addProduct')
                }
            })
        }
    })
}
  

module.exports = 
{
    getadminlogin,
    login,
    adminHome,
    addProductpage,
    addProduct
}