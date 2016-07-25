
# Demo

----

````js
seajs.use(["socket-io"], function(io){
  console.log(io)
  var socket = io.connect("/");
  socket.on("reload", function(){
    location.reload();
  });
});
````
