let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}


//Create a Pixi Application
let app = new PIXI.Application({width: 1024, height: 1024});
app.renderer.backgroundColor = 0x000000;

//Add the canvas that Pixi automatically created for you to the HTML document

document.body.appendChild(app.view);

// Bakgrund
const background = PIXI.Sprite.from('images/orbit_space.png');
background.x = 0
background.y = 0


// Skapa rocket
const rocket = PIXI.Sprite.from('images/tefat.png');
rocket.anchor.set(0.5);

rocket.int_array_len = 20000
rocket.int_array = [];
rocket.int_window_array = [];

// Graphics
const graphics = new PIXI.Graphics();


// Integral array
for(var i = 0; i < rocket.int_array_len; i++) {
    rocket.int_array.push(0);
}
// Integral window array
for(var i = 0; i < rocket.int_array_len; i++) {
    rocket.int_window_array.push(i*(1/(rocket.int_array_len-1)));
}


rocket.x = app.screen.width / 2;
rocket.y = 80;
rocket.anchor.x = 0.5
rocket.anchor.y = 0.5
rocket.zIndex = 2
graphics.zInde = 1

rocket.scale.x = 1
rocket.scale.y = 1

rocket.vy = 0


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

app.stage.addChild(background)
app.stage.addChild(rocket);
app.stage.addChild(graphics);



app.ticker.maxFPS = 60

const pstyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    // fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#77ff77'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round'
});

const istyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    // fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#ffff77'], // gradient
    stroke: '#000000',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round'
});

const dstyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    // fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#77ffff'], // gradient
    stroke: '#000000',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round'
});

const estyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    // fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#990000', '#ff9999'], // gradient
    stroke: '#000000',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round'
});

console.log(app.screen.width)
const P_Text = new PIXI.Text('PT:', pstyle);
P_Text.anchor.x = 0.5
P_Text.x = Math.round(app.screen.width * (1/4))
P_Text.y = 0;

const I_Text = new PIXI.Text('IT:', istyle);
I_Text.anchor.x = 0.5
I_Text.x = Math.round(app.screen.width * (2/4))
I_Text.y = 0;

const D_Text = new PIXI.Text('DT:', dstyle);
D_Text.anchor.x = 0.5
D_Text.x = Math.round(app.screen.width * (3/4))
D_Text.y = 0;

const E_Text = new PIXI.Text('ET:', estyle);
E_Text.anchor.x = 0.5
E_Text.x = Math.round(app.screen.width * (1/2))
E_Text.y = Math.round(app.screen.height * (19/20));

app.stage.addChild(P_Text);
app.stage.addChild(I_Text);
app.stage.addChild(D_Text);
app.stage.addChild(E_Text);

rocket.target_y = 500

app.ticker.add(function(delta) {

    
    // Styrvariabler
    rocket.p_coeff = 70
    rocket.i_coeff = 1
    rocket.d_coeff = 100
    

    //Miljövariabler
    rocket.dnoise_strenth = 10000
    rocket.mass = 5000
    gravity = 3
    rocket.mass = 1000   // kg
    // Störningar
    rocket.dnoise = Math.random() * rocket.dnoise_strenth

    //Gravitation
    rocket.gforce_y = rocket.mass * gravity

    // P
    rocket.error_y = rocket.target_y - rocket.y

    // I
    rocket.int_array.push(rocket.error_y);
    rocket.int_array.shift()
    rocket.int_array_windowed = []
    for(var i = 0; i < rocket.int_array_len; i++) {
        rocket.int_array_windowed.push(rocket.int_array[i]*rocket.int_window_array[i])}
    rocket.error_int_y = rocket.int_array_windowed.reduce((a, b) => a + b, 0)  // / rocket.int_array_len

    // D
    rocket.error_deriv_y = (rocket.error_y - rocket.previous_error_y) / seconds_per_frame
    rocket.p_thrust = rocket.error_y * rocket.p_coeff
    rocket.i_thrust = rocket.error_int_y * rocket.i_coeff
    rocket.d_thrust = rocket.error_deriv_y * rocket.d_coeff
    rocket.total_thrust =  rocket.p_thrust + rocket.i_thrust  + rocket.d_thrust;

    // Rocket-Rörelse
    rocket.ay = (rocket.gforce_y + rocket.total_thrust + rocket.dnoise) / rocket.mass
    rocket.vy += rocket.ay * seconds_per_frame
    rocket.pvy = rocket.vy * pixels_per_meter
    rocket.y += rocket.pvy

    // Grafikrörelse
    graphics.clear();
    
    // Rocket y line
    graphics.lineStyle(2, 0xffd900, 1);
    graphics.alpha = 0.6;
    graphics.moveTo(0, rocket.y);
    graphics.lineTo(app.screen.width, rocket.y);
    // Target y line
    graphics.lineStyle(2, 0xffd9d9, 1);
    graphics.moveTo(0, rocket.target_y);
    graphics.lineTo(app.screen.width, rocket.target_y);
    // P-Thrust line
    graphics.lineStyle(6, 0xd9ffd9, 1);
    graphics.moveTo(rocket.x-5, rocket.y + ((rocket.p_thrust > 0) ? -16 : 16));
    graphics.lineTo(rocket.x-5, rocket.y + ((rocket.p_thrust > 0) ? -16 : 16) - rocket.p_thrust/40)
    // I-Thrust line
    graphics.lineStyle(6, 0xffffd9, 1);
    graphics.moveTo(rocket.x, rocket.y + ((rocket.i_thrust > 0) ? -16 : 16));
    graphics.lineTo(rocket.x, rocket.y + ((rocket.i_thrust > 0) ? -16 : 16) - rocket.i_thrust/40)
    // D-Thrust line
    graphics.lineStyle(6, 0xd9d9ff, 1);
    graphics.moveTo(rocket.x+5, rocket.y + ((rocket.d_thrust > 0) ? -16 : 16));
    graphics.lineTo(rocket.x+5, rocket.y + ((rocket.d_thrust > 0) ? -16 : 16) - rocket.d_thrust/40)
    

    graphics.endFill();
    

    // Logga & scorekeeping
    // rocket.cum_thrust += Math.abs(rocket.thrust)
    // rocket.cum_error += Math.abs(rocket.error_y)

    // console.log(
    //     // "Fuel price: ",
    //     // Math.round(rocket.cum_thrust * cost_per_thrust),
    //     // " kr, \t",
    //     // "Total error: ", 
    //     // Math.round(rocket.cum_error),
    //     // "\t",
    //     // "CE:",
    //     // Math.round(rocket.error_y),
    //     // "IE :",
    //     // Math.round(rocket.error_int_y,2)
    //     //"\t",
    //     // "CT:",
    //     // Math.round(rocket.total_thrust),
    //     // "PT:",
    //     // Math.round(rocket.p_thrust),
    //     // "IT:",
    //     // Math.round(rocket.i_thrust),
    //     // "DT:",
    //     // Math.round(rocket.d_thrust),
    //     // "IE :",
    //     // Math.round(rocket.error_int_y,2)

    //     )

    // Housekeeping
    rocket.previous_error_y = rocket.error_y

    //Texter
    P_Text.text='PT: ' + -Math.round(rocket.p_thrust)
    I_Text.text='IT: ' + -Math.round(rocket.i_thrust)
    D_Text.text='DT: ' + -Math.round(rocket.d_thrust)
    E_Text.text='Error: ' + Math.round(rocket.error_y)
});

app.renderer.plugins.interaction.on('pointerup', onClick);

function onClick (event) {
    
    rocket.target_y = event.data.global.y;
    console.log("New target:", rocket.target_y);
    // sprite.scale.y = event.data.global.y / (app.screen.height / 2);
}