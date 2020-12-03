let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}


//Create a Pixi Application
let app = new PIXI.Application({width: 1024, height: 1024});
app.renderer.backgroundColor = 0x80C0FF;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

const rocket = PIXI.Sprite.from('images/rocket.png');
rocket.anchor.set(0.5);

rocket.x = app.screen.width / 2;
rocket.y = 0;
rocket.anchor.x = 0.5
rocket.anchor.y = 0.5

rocket.scale.x = 0.2
rocket.scale.y = 0.2

rocket.vy = 1
rocket.mass = 100   // kg
gravity = 9.81      // N/kg ??
fps = 60
pixels_per_meter = 5
seconds_per_frame = 1/fps
time = 0
cost_per_thrust = 2


rocket.error_y = 0
rocket.previous_error_y = 0
rocket.error_deriv_y = 0
rocket.error_int_y = 0
rocket.cum_thrust = 0
rocket.cum_error = 0

app.stage.addChild(rocket);
app.ticker.maxFPS = 60


app.ticker.add(function(delta) {
    //Gravitation
    rocket.gforce_y = rocket.mass * gravity

    // Regulering
    rocket.p_coeff = 4
    rocket.i_coeff = 0
    rocket.d_coeff = 1
    
    rocket.target_y = 500
    

    rocket.error_y = rocket.target_y - rocket.y
    rocket.error_deriv_y = (rocket.error_y - rocket.previous_error_y) / seconds_per_frame
    // TODO
    rocket.error_int_y = 0

    rocket.thrust = rocket.error_y * rocket.p_coeff + rocket.error_deriv_y * rocket.d_coeff + rocket.error_int_y * rocket.i_coeff;

    // Rörelse
    rocket.ay = (rocket.gforce_y + rocket.thrust) / rocket.mass
    rocket.vy += rocket.ay * seconds_per_frame
    rocket.pvy = rocket.vy * pixels_per_meter
    rocket.y += rocket.pvy

    // Logga & scorekeeping
    rocket.cum_thrust += Math.abs(rocket.thrust)
    rocket.cum_error += Math.abs(rocket.error_y)

    console.log("Fuel price: ",
        Math.round(rocket.cum_thrust * cost_per_thrust),
        " kr, \t",
        "Total error: ", 
        Math.round(rocket.cum_error),
        "\t",
        "Current Error: ",
        Math.round(rocket.error_y),
        "\t",
        "Current Thrust: ",
        Math.round(rocket.thrust)
        )

    // Housekeeping
    rocket.previous_error_y = rocket.error_y
});