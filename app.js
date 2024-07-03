const express = require("express");
const bodyParser = require("body-parser");
var _=  require('lodash');
const mongoose = require('mongoose');

const app = express();

const TodoDB = mongoose.connect("mongodb+srv://admin-tushar:test1234@cluster0.2j57not.mongodb.net/TodoDB");
const TaskSchema = {
    name: String
}
const Task = mongoose.model("Task", TaskSchema);


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", 'ejs');



app.get("/", function(req, res){

    var list = []
    Task.find().then((data)=>{
        
        data.forEach(element =>{
            list.push(element.name);
        })

        res.render("list",{path:"", taskList:list});
    })
    
})


app.post('/', function(req, res){
    const newtask = req.body.newtask;
    if(newtask.length>0) {
        task = new Task({name : newtask});
        task.save();
    };
    res.redirect('/');
})

app.post('/delete', function(req, res){
    
    Task.deleteOne({name:Object.keys(req.body)[0]}).then(()=>{
        res.redirect('/');
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
    });
    
})

app.get("/:path", function(req, res){
    const path = _.capitalize(req.params.path);
    const pathTask = mongoose.models[path] || mongoose.model(path, TaskSchema);

    var list = []
    pathTask.find().then((data)=>{
        
        data.forEach(element =>{
            list.push(element.name);
        })

        res.render("list",{path:path, taskList:list});
    })

})

app.post('/:path', function(req, res){
    const newtask = req.body.newtask;
    const path = _.capitalize(req.params.path);
    const pathTask = mongoose.models[path] || mongoose.model(path, TaskSchema);

    if(newtask.length>0) {
        task = new pathTask({name : newtask});
        task.save();
    };
    res.redirect(`/${path}`);
})

app.post('/:path/delete', function(req, res){
    
    const path = _.capitalize(req.params.path);
    const pathTask = mongoose.models[path] || mongoose.model(path, TaskSchema);
    pathTask.deleteOne({name:Object.keys(req.body)[0]}).then(()=>{
        res.redirect(`/${path}`);
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
    });
    
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server Started!")
})