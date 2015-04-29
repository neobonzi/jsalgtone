requirejs.config({
	baseUrl: 'lib',
	paths: {
		boids: '../boids'
	}
});

requirejs(['boids/main']);