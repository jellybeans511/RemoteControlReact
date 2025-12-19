let front_value = [ 2945.977111,2242.625076,1733.301188,1389.557563,1083.577788,824.873591,637.5360691,511.1016324 ];
let back_value = [ 2954.394188,2249.032576,1738.253477,1393.527727,1086.673724,827.2303727,639.3576008,512.5619227 ];

//let out_rpm;
//let out_gear;

exports.Morita_function=(speed)=> {
	if (speed < 0.34) { console.log('Speed is too low'); return 1; }
	if (speed > 5.09) { console.log('Speed is too high'); return 2; }
	var calculated_rpm;
	for (var i = 1; i <= 8; i++) {
		calculated_rpm = Math.round(front_value[i - 1] * speed);
		if (1000 < calculated_rpm && calculated_rpm < 2600) {
			var calc_re = {
			out_gear:i,
			out_rpm:calculated_rpm
			};
		}
    }
    return calc_re;
}

/*let Test=()=> {
	for(let i=0.34;i<5.09;i=i+0.1){
		speed=i;
		Morita_function(speed);
		process.stdout.write(String(speed.toFixed(2)));
		for(let k=0;k<(out_rpm/100);k++){
			process.stdout.write('  ');
		}
		console.log(out_gear);
	}
	console.log('');
}*/

/*Test();
console.log('This is Morita_function');
console.log('');
process.stdout.write('speed:(0.34~5.09) or exit=>');

var standard_input = process.stdin;
standard_input.setEncoding('utf-8');

standard_input.on('data', function (speed) {

		let out_speed=(speed+"").split('\r');
		out_gear=0;
		out_rpm=0;

		if(out_speed[0]=='exit'){
			console.log('------exit-------');
			process.exit(1);
		}
		var error = 100;
		error = Morita_function(parseFloat(out_speed[0]));

		if(error!=1&&error!=2){
		console.log('------out put-------');
		console.log('|speed:'+out_speed[0]);
		console.log('|rpm:'+out_rpm);
		console.log('|gear:'+out_gear);
		}
		console.log('');

		//next
		process.stdout.write('speed:(0.34~5.09) or exit=>');
});

process.on('exit', (code) => {
	console.log(`About to exit with code: ${code}`);
  });*/