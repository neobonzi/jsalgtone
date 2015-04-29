define(function (require) {
	var utils = require('./utils');
	var Victor = require('Victor');
	var self = {
		calcCenterOfMass: function (boids) {
				var boidIndex = 0;
				var centerOfMass = new Victor(0,0);
				for (; boidIndex < boids.length; boidIndex++) {
					centerOfMass.add(boids[boidIndex].pos);
				}
				return centerOfMass.divide(new Victor(boids.length, boids.length));
			},
		/**
		 * Boid Rule 1: Boids must fly towards center of mass.
		 * @param {Boid} boid - the boid whose rule result will be calculated
		 * @param {int} centerOfMass - the center of mass of the boids
		 * @param {int} bias - how much a boid should steer towards mass.
		 */
		rule1: function(boid, centerOfMass, bias) {
			var boidPosCopy = boid.pos.clone();
			var centerOfMassCopy = centerOfMass.clone();
			var biasVector = new Victor(bias, bias);
			return centerOfMassCopy.subtract(boidPosCopy).divide(biasVector);
		},
		/**
		 * Boid Rule 2: Boids must try to keep a small distance from one another
		 * @param {Boid} boid - the boid whose rule result will be calculated
		 * @param {Array} boids - all boids in flock
		 * @param {int} range - minimum distance to be 'near' something else.
		 * @param {int} bias - how much a boid should steer towards mass.
		 */
		rule2: function(boid, boids, range) {
		 	var boidCount = 0;
		 	var resultVector = new Victor(0, 0);
		 	for(; boidCount < boids.length; boidCount++)
		 	{
		 		var curBoid = boids[boidCount];
		 		var distance = Math.abs(boid.pos.distance(curBoid.pos));

		 		if (curBoid != boid && distance < range)
		 		{
		 			var curBoidPos = curBoid.pos.clone();
		 			curBoidPos.subtract(boid.pos);
		 			resultVector.subtract(curBoidPos);
		 		}
		 	}
		 	return resultVector;
		},
		/**
		 * Boid Rule 3: Boids must try to match velocity with near boids.
		 * @param {Boid} boid - the boid whose rule result will be calculated
		 * @param {Array} boids - all boids in flock
		 * @param {int} range - minimum distance to be 'near' something else.
		 * @param {int} bias - how much a boid should try to match flock speed
		 */
		rule3: function(boid, boids, range) {
		 	var boidCount = 0;
		 	var resultVector = new Victor(0, 0);
		 	for(; boidCount < boids.length; boidCount++)
		 	{
		 		var curBoid = boids[boidCount];
		 		if (curBoid != boid)
		 			resultVector.add(curBoid.vel)
		 	}
		 	//Scale back the result
		 	return resultVector.divide(new Victor(range, range));
		},

		boundsRule: function(boid, x, y, magnitude) {
			var resultVector = new Victor(0,0);
			if (boid.pos.x < 0) {
				resultVector.add(new Victor(magnitude, 0));
			} else if (boid.pos.x > x) {
				resultVector.add(new Victor(-1 * magnitude, 0));
			}

			if (boid.pos.y < 0){
				resultVector.add(new Victor(0, magnitude));
			} else if (boid.pos.y > y) {
				resultVector.add(new Victor(0, -1 * magnitude));
			}
			return resultVector;
		},

		move : function(boids, centerOfMass, r1Bias, r2Range, r3Range, xBound, yBound, returnMagnitude) {
			var boidIndex = 0;
			for (; boidIndex < boids.length; boidIndex++) {
				var curBoid = boids[boidIndex];
				var v1 = self.rule1(curBoid, centerOfMass, r1Bias);
				var v2 = self.rule2(curBoid, boids, r2Range);
				var v3 = self.rule3(curBoid, boids, r3Range);
				var v4 = self.boundsRule(curBoid, xBound, yBound, returnMagnitude);
				curBoid.velocity = curBoid.vel.add(v1).add(v2).add(v3).add(v4);
				curBoid.pos = curBoid.pos.add(curBoid.velocity);
			}
		}
	};
	return self;
});


