if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");

app.engine('ejs', ejsMate);
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

const listingRouter = require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy= require("passport-local");
const User=require("./models/user.js");
//const Reviews=require("./models/review.js");
//mongose

const dburl=process.env.ATLASDB_URL;
main().then( ()=>{console.log("connected to db")})
.catch((err)=>{console.log(err)});

async function main( ) {
    await mongoose.connect(dburl);
}
let port = 8080;
app.set("view engine", "ejs");
app.listen(port,()=>{
    console.log(`port is listening ${port}`);
});

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
});
store.on("error",()=>{
    console.log("error in mongo session store",err);
})
 const sessionOptions ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
    expire:Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true,
    }
 };
//  app.get("/",(req,res)=>{
//     res.send("working");
// });


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error =req.flash("error");
res.locals.currUser = req.user;
next();
});



//routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});