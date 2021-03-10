
//
//
const BodyParser      = require('body-parser'),
      metodOverride   =require('method-override'),
      expressSentizer =require('express-sanitizer'),
      mongoose        = require('mongoose'),
      express         =require('express'),
      app             = express();

mongoose.connect("mongodb+srv://amirsg:BJyUPIzDLneGrRFQ@cluster0.c3rvt.mongodb.net/Blog_App", {useNewUrlParser :true , useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(BodyParser.urlencoded({extended:true}));
app.use(expressSentizer());
app.use(metodOverride("_method"));

const BlogSchema =  new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    create:{type:Date, default:Date.now}
});
const Blog   = mongoose.model("Blog",BlogSchema);


//=======================
// Redirect to Home Page
//=======================

app.get("/",function(req, res){
	res.redirect("/blogs");
});

//===================
// The All Blog Page
// ==================
app.get("/blogs", function(req,res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}
		else{
		    res.render("index", {blogs:blogs});
		}
	});
});

//===================
//Add New Blog Form
//===================

app.get("/blogs/new", function(req,res){
	res.render("new");
});

//=====================
// Create Blog Method
//=====================
app.post("/blogs" ,function(req,res){
	req.body.blog.body =req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}
		else
		{
			res.redirect("/blogs");
		}
	})
})

//============
// Show Page
//============

app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id , function(err, foundBlog){
		if (err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});
		}
	});
});

//============
// Edit Page
//============

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit" ,{blog:foundBlog});
		}
	});
});

//===============
// Update Page
//===============
app.put("/blogs/:id",function(req,res){
	req.body.blog.body =req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog ,function(err,updateBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" +req.params.id);
		}
	})
});

//==============
//Delete Route
//=============
app.delete("/blogs/:id",function(req, res){
	// Destroy The Blog
	Blog.findByIdAndRemove(req.params.id , function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
});
//===================
// Listening Server 
// ==================

let port = process.env.PORT;
if(port==null || port==""){
	port=3000;
}
app.listen(port,function(){
	console.log("Server Start On Port 3000");
});
