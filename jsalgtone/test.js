(function () {

    // JavaScript strict mode is a good thing.
    "use strict";

    // Define a unique global namespace for your stuff.
    // You should change this to a namespace that is appropriate for your project.
    fluid.registerNamespace("myStuff");

    var enviro = flock.init();

    // Expose any public functions or constructors as properties on your namesapce.
    myStuff.play = function () {
        var mySynth = flock.synth({
            synthDef: {
                ugen: "flock.ugen.sin",
                freq: {
                    id: "noise",
                    ugen: "flock.ugen.sinOsc",
                    freq: 10,
                    mul: 380,
                    add: 60
                },
                mul: 0.1
            }
        });

        $("#myButton").click(function() {
            var newFreq = Math.random() * 10;
            mySynth.set("noise.freq", newFreq);
        });

        // If you're on iOS, you will need to call in a listener for
        // some kind of user input action, such a button click or touch handler.
        // This is because iOS will only play sound if the user initiated it.
        enviro.play();
    };

}());