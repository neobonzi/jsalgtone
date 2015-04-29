define(['Victor'], function (Victor, procedures) {

	var boidType = function (start_x, start_y, startv_x, startv_y) {
			this.pos = new Victor(start_x, start_y);
			this.vel = new Victor(startv_x, startv_y);
		};
		
	return {
		Boid: boidType
	}
});