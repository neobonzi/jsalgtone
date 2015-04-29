define(function(require) {
	var Boid = require('./boid').Boid;
	var procedures = require('./procedures');
	var Victor = require('Victor');
	var Utils = require('./utils');

	var boid1 = new Boid(1, 5, 0, 0);
	var boid2 = new Boid(2, 6, 0, 0);
	var boid3 = new Boid(3, 7, 0, 0);
	var boidArray = [boid1, boid2, boid3];

	/**
	 * Calculate the center of mass of a group of voids.
	 */
	QUnit.test("Center Of Mass Test", function(assert){
		var correctMass = new Victor(2, 6);
		var testMass = procedures.calcCenterOfMass(boidArray);
		assert.ok(testMass.x == correctMass.x && testMass.y == correctMass.y);
	});

	/**
	 * Boids should not be equal to eachother, even if they have the same pos,
	 * this is kind of 'duh'.
	 */
	QUnit.test("Equal Boids", function(assert) {
		var boid1 = new Boid(1, 5);
		var boid2 = new Boid(1, 5);
		assert.notEqual(boid1, boid2);
	});

	QUnit.test("Rule1: Fly Towards Center of Mass Test", function(assert){
		// Center of Mass is (2, 6), boid is at (1, 5), should move (-1 / 100, -1 / 100)
		var centerOfMass = procedures.calcCenterOfMass(boidArray);
		var bias = 100;
		var rule1Result = procedures.rule1(boid1, centerOfMass, bias);
		var expectedRule1Result = new Victor(-1 / 100, -1 / 100);
		assert.ok(rule1Result.x == expectedRule1Result.x && rule1Result.y == expectedRule1Result.y);
	});

	QUnit.test("Rule2: Test X", function(assert){
		var boid1 = new Boid(5, 0, 0, 0);
		var boid2 = new Boid(4, 0, 0, 0);
		var boids = [boid1, boid2];

		var result = procedures.rule2(boid1, boids, 50);
		assert.ok(result.x == 1 && result.y == 0);
	});

	QUnit.test("Rule2: Test Y", function(assert){
		var boid1 = new Boid(0, 5, 0, 0);
		var boid2 = new Boid(0, 3, 0, 0);
		var boids = [boid1, boid2];

		var result = procedures.rule2(boid1, boids, 50);
		assert.ok(result.x == 0 && result.y == 2);
	});

	QUnit.test("Rule2: Test 2D", function(assert){
		var boid1 = new Boid(2, 2, 0, 0);
		var boid2 = new Boid(5, 5, 0, 0);
		var boids = [boid1, boid2];

		var result = procedures.rule2(boid1, boids, 50);
		assert.ok(result.x == -3 && result.y == -3);
	});

	QUnit.test("Rule3: Test Single Velocity Matching", function(assert){
		var boid1 = new Boid(2, 2, 1, 5);
		var boid2 = new Boid(5, 5, 2, 2);
		var boids = [boid1, boid2];

		var result = procedures.rule3(boid1, boids, 1);
		assert.ok(result.x == 2 && result.y == 2);
	});

	QUnit.test("Rule3: Test Double Velocity Matching", function(assert){
		var boid1 = new Boid(2, 2, 1, 5);
		var boid2 = new Boid(5, 5, 2, 2);
		var boid3 = new Boid(50, 50, 22, 11);
		var boids = [boid1, boid2, boid3];

		var result = procedures.rule3(boid1, boids, 1);
		assert.ok(result.x == 24 && result.y == 13);
	});

	QUnit.test("Move Test", function(assert){
		var boid1 = new Boid(2, 2, 1, 5);
		var boid2 = new Boid(5, 5, 2, 2);
		var boid3 = new Boid(10, 10, 2, 1);
		var boids = [boid1, boid2, boid3];
		var boidCopy = Utils.cloneBoids(boids);
		var centerOfMass = procedures.calcCenterOfMass(boids);

		var result = procedures.move(boidCopy, centerOfMass, 100, 100, 8);
		console.log(boids);
		console.log(boidCopy)
		assert.ok(true);
	});

	QUnit.test("Clone Boid Test", function(assert){
		var boid1 = new Boid(2, 2, 1, 5);
		var boid2 = new Boid(5, 5, 2, 2);
		var boid3 = new Boid(10, 10, 2, 1);
		var boids = [boid1, boid2, boid3];
		var boidsClone = Utils.cloneBoids(boids);
		var boidIndex = 0;
		for(; boidIndex < boids.length; boidIndex++) {
			assert.ok(boids[boidIndex] != boidsClone[boidIndex]);
			assert.ok(boids[boidIndex].pos.x == boidsClone[boidIndex].pos.x);
			assert.ok(boids[boidIndex].pos.y == boidsClone[boidIndex].pos.y);
			assert.ok(boids[boidIndex].vel.x == boidsClone[boidIndex].vel.x);
			assert.ok(boids[boidIndex].vel.y == boidsClone[boidIndex].vel.y);
		}
	});
});