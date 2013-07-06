var app = require('express')()
  , express = require('express') 
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , AssetProvider= require ('./assetprovider').AssetProvider;
  
var assetProvider= new AssetProvider('localhost', 27017);
  
  
server.listen(80);
  
//Specify the views folder

//app.set("views",__dirname);


//View engine is Jade

//app.set("view engine", "jade");

app.use(express.static("public", __dirname +"/public"));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/saml.html');
  //res.render("index");
});
  
io.sockets.on('connection', function (socket) {
  socket.on('my other event', function (data) {
    console.log(data);
  });
 socket.emit("jinga",{lala:'hu'});
 socket.on('jinga', function (blah){
 console.log("jinga");
 console.log(blah); 
  });
 socket.emit("change");
 socket.on("start",function(data){
		console.log(data);
		assetProvider.findAsset(1,function(error,result){
		socket.emit("first",result);});
		assetProvider.findAsset(2,function(error,result){
		socket.emit("second",result);});
		assetProvider.findAsset(3,function(error,result){
		socket.emit("third",result);});
		assetProvider.findAsset(4,function(error,result){
		socket.emit("fourth",result);});
 });

  socket.on("onmousedown", function (data) {
    var abc=data;
    console.log("id = " + data.lock);
    assetProvider.findAsset(data.lock,function(error,result){
			console.log(result);
                        console.log(result.status);
			if (result.status=='unlock')
				{console.log("Go Ahead");
				socket.emit("ok",data);
				var newStat = "lock";
				assetProvider.updateStat(data.lock,newStat,function				(error,newStat){console.log("updated");});}
			else
				console.log("Shut the fuck up.");
			});    
  });
  socket.on("onmousemove", function (data) {
    var xyz=data;
    console.log("left:" +xyz.left+" , top:" +xyz.top);
    assetProvider.updateLoc(xyz.id,xyz,function(error,xyz){
				socket.broadcast.emit("new",data);});
  });
  socket.on("onmouseup", function (data) {
    console.log("id = " +data.unlock);
    var newStat = "unlock";
  assetProvider.updateStat(data.unlock,newStat,function(error,newStat){   console.log("updated");});
  socket.broadcast.emit("mouseup",data);
  });
});