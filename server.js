var express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http),
port = process.env.PORT || 3000,
user = require('./models/user');

app.set('view engine', 'jade');


app.use('/bootstrap-css' ,express.static(__dirname+'/node_modules/bootstrap/dist/css/'));
app.use('/bootstrap-js' ,express.static(__dirname+'/node_modules/bootstrap/dist/js/'));
app.use('/font-awesome', express.static(__dirname+'/node_modules/font-awesome/css/'))
app.use('/jquery' ,express.static(__dirname+'/node_modules/jquery/dist/'));
app.use('/popperjs', express.static(__dirname+'/node_modules/popper.js/dist/umd/'));
app.use('/static', express.static('public'));

app.get('/', function(req, res) {
	res.render('main');
});

io.on('connection', function(socket){
	console.log('Usuario conectado!!');
	socket.on('crear', function(data){
		console.log(data);
		user.create(data, function(rpta){
			io.emit('nuevo', rpta)
		});
	});
	socket.on('nuevo', function(data){
		fill(data);
	});
	var fill = function(data){
		var $row = $('<tr id="'+data._id+'">');
		$row.append('<td>'+data._id+'</td>');
		$row.append('<td>'+data.first_name+'</td>');
		$row.append('<td>'+data.last_name+'</td>');
		$row.append('<td>'+data.timezone+'</td>');
		$row.append('<td>'+data.locale+'</td>');
		$row.append('<td>'+data.profile_pic+'</td>');
		$row.append('<td><button class="btn btn-success btn-sm" name="btnAct">Actualizar</button></td>');
		$row.append('<td><button class="btn btn-danger btn-sm" name="btnEli">Eliminar</button></td>');
		$row.data('data',data);
		$('table tbody').append($row);
	};
	socket.on('disconnect', function(){
		console.log('Usuario Desconectado!!');
	});
});

http.listen(port, function(){
	console.log('Servidor conectado en *:' + port);
});