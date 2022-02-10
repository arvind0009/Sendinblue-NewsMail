var exp=require("express");
var app=exp();
var request=require("request");
var bp=require("body-parser");
const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();
// const { response } = require("express");
app.use(exp.static("Public"));
app.use(bp.urlencoded({extended : true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
app.post("/" ,function(req,res){
    let firstname=req.body.fname;
    let lastname=req.body.lname;
    let email=req.body.email;
    let apikey=process.env.API_KEY;
    
    // auth + setup
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = apikey;
 
    let apiInstance = new SibApiV3Sdk.ContactsApi();
 
    let createContact = new SibApiV3Sdk.CreateContact();

    createContact.email = email;
    createContact.listIds = [2];
    createContact.attributes = {firstname, lastname};
    apiInstance.createContact(createContact).then(function(data) {

        res.sendFile(__dirname + "/success.html");

    }, function(error) {
        let text = JSON.parse(error.response.text);
        if(text.code === "duplicate_parameter") {
            // console.log(text);

            res.sendFile(__dirname + "/used_mail.html");
        }
        else {
            // console.error(error.response);

            res.sendFile(__dirname + "/failure.html");
        }
    });
    app.post("/failure",function(req,res){
        res.redirect("/");
    });
    app.post("/success",function(req,res){
        res.redirect("/");
    });
    app.post("/used_mail",function(req,res){
        res.redirect("/");
    });
    
});
app.listen(process.env.PORT || 3500, function() {
    console.log("server live at port 3500");
});