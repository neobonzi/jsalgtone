define(function (require) {
	var Boid = require('./boid').Boid;
	var procedures = require('./procedures');
	var Victor = require('Victor');
	var Utils = require('./utils');
	var JCanvas = require('jcanvas');

	var boidList = [];
	var numBoids = 5;
	var max_x = 100;
	var max_y = 100;
	var boidIndex = 0;
	for (; boidIndex < numBoids; boidIndex++) {
		var newBoid = new Boid(Math.random() * max_x, Math.random() * max_y, 0, 0);
		boidList.push(newBoid);
		$('canvas').drawEllipse({
			fillStyle: '#000',
			x: newBoid.pos.x, y: newBoid.pos.y,
			width: 5, height: 5
		});

	}

	/**
	 * Music stuff
	 */
	var enviro = flock.init();
	var synthSources = [];
	console.log(synth);
	var fundamental = 110;
	$('canvas').clearCanvas();
	for(boidIndex = 0; boidIndex < numBoids; boidIndex++) {
		synthSources.push({
			    id: "boid" + boidIndex,          // Name this unit generator "carrier," exposing it as an input to the synth.
			    ugen: "flock.ugen.sinOsc",      // Sine oscillator ugen.
			    freq: fundamental * (boidIndex + 1),  // Give it a frequency of 440 Hz, or the A above middle C.
			    mul: 1});
	}
	var synth = flock.synth({synthDef: {ugen: "flock.ugen.sum", sources: synthSources}});
	enviro.play();


	var timeStep = 0;
	var centerOfMass = procedures.calcCenterOfMass(boidList);
	while(timeStep++ < 1000) {
		setTimeout(function() {
			$('#boidList').empty();
			$('#boidList').append("<b>Center of Mass:</b> " + centerOfMass);
			var boidIndex = 0;
			$('canvas').clearCanvas();
			for (; boidIndex < boidList.length; boidIndex++) {
				var curBoid = boidList[boidIndex];
				$('#boidList').append("<li><b>Boid </b>" + boidIndex);
				$('#boidList').append("<ul><li><b>X:</b> " + boidList[boidIndex].pos.x + "</li>");
				$('#boidList').append("<li><b>Y:</b> " + boidList[boidIndex].pos.y + "</li>");
				$('#boidList').append("<li><b>Vel X:</b> " + boidList[boidIndex].vel.x + "</li>");
				$('#boidList').append("<li><b>Vel Y:</b> " + boidList[boidIndex].vel.y + "</li>");
				$('#boidList').append("</ul></li>");
				var carrierString = "boid" + boidIndex;
				$('canvas').drawEllipse({
					fillStyle: '#000',
					x: curBoid.pos.x, y: curBoid.pos.y,
					width: 5, height: 5
				});
				synth.set(carrierString + ".mul", (1 / curBoid.vel.length()) * boidIndex );
			}
			//Param 1 Boid List
			//Param 2 Center of Mass
			//Param 3 How hard boids try to get to center of mass (lower == harder)
			var centerBias = 15;
			//Param 4 Radius boids should consider when trying to "stay away" from others
			var proximityBias = 10;
			//Param 5 How hard bodis should try to match velocity of flock (lower == harder)
			var velocityBias = 1000;
			//Param 6, 7 Border constraints
			var maxX = 500, maxY = 500;
			//Param 8 How hard boids should try to stay in border
			var constraintBias = 3;
			procedures.move(boidList, centerOfMass, centerBias, proximityBias, velocityBias, maxX, maxY, constraintBias);
			centerOfMass = procedures.calcCenterOfMass(boidList);
		}, 100 * timeStep);
	}
});