define(function (require) {
	var Boid = require('./boid').Boid;

	return {
		cloneBoids: function(boidList) {
			var boidIndex = 0;
			var newBoidList = [];
			for (; boidIndex < boidList.length; boidIndex++)
			{
				var curBoid = boidList[boidIndex];
				var newBoid = new Boid(curBoid.pos.x, curBoid.pos.y, curBoid.vel.x, curBoid.vel.y);
				newBoidList.push(newBoid);
			}
			return newBoidList;
		}
	}
});