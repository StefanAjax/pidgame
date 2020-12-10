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

// Initiera styrvariabler
rocket.p_coeff = 0
rocket.i_coeff = 0
rocket.d_coeff = 0

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
rocket.y = 580;
rocket.anchor.x = 0.5
rocket.anchor.y = 0.5
rocket.zIndex = 2
graphics.zInde = 1

rocket.scale.x = 1
rocket.scale.y = 1

rocket.vy = 0

rocket.target_vy = 0


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
    fill: ['#ffCCCC', '#BB4444'], // gradient
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

const infostyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    // fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#BBBBBB'], // gradient
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

const shiftTopText = 40
const lineYShift  = 40

const P_Text = new PIXI.Text('PT:', pstyle);
P_Text.anchor.x = 0
P_Text.x = Math.round(app.screen.width * (1/4) - shiftTopText)
P_Text.y = 0;

const I_Text = new PIXI.Text('IT:', istyle);
I_Text.anchor.x = 0
I_Text.x = Math.round(app.screen.width * (2/4) - shiftTopText)
I_Text.y = 0;

const D_Text = new PIXI.Text('DT:', dstyle);
D_Text.anchor.x = 0
D_Text.x = Math.round(app.screen.width * (3/4) - shiftTopText)
D_Text.y = 0;

const Pk_Text = new PIXI.Text('Pk:', pstyle);
Pk_Text.anchor.x = 0
Pk_Text.x = Math.round(app.screen.width * (1/4) - shiftTopText)
Pk_Text.y = lineYShift;

const Ik_Text = new PIXI.Text('Ik:', istyle);
Ik_Text.anchor.x = 0
Ik_Text.x = Math.round(app.screen.width * (2/4) - shiftTopText)
Ik_Text.y = lineYShift;

const Dk_Text = new PIXI.Text('Dk:', dstyle);
Dk_Text.anchor.x = 0
Dk_Text.x = Math.round(app.screen.width * (3/4) - shiftTopText)
Dk_Text.y = lineYShift;


const E_Text = new PIXI.Text('ET:', estyle);
E_Text.anchor.x = 0
E_Text.x = Math.round(app.screen.width * (1/10) - shiftTopText)
E_Text.y = Math.round(app.screen.height * (19/20));

const G_Text = new PIXI.Text('Grav:', infostyle);
G_Text.anchor.x = 0
G_Text.x = Math.round(app.screen.width * (3/10))
G_Text.y = Math.round(app.screen.height * (19/20));

const T_Text = new PIXI.Text('Turb:', infostyle);
T_Text.anchor.x = 0
T_Text.x = Math.round(app.screen.width * (5/10))
T_Text.y = Math.round(app.screen.height * (19/20));

const MT_Text = new PIXI.Text('MxThr:', infostyle);
MT_Text.anchor.x = 0
MT_Text.x = Math.round(app.screen.width * (7/10))
MT_Text.y = Math.round(app.screen.height * (19/20));

app.stage.addChild(P_Text);
app.stage.addChild(I_Text);
app.stage.addChild(D_Text);
app.stage.addChild(Pk_Text);
app.stage.addChild(Ik_Text);
app.stage.addChild(Dk_Text);
app.stage.addChild(E_Text);
app.stage.addChild(G_Text);
app.stage.addChild(T_Text);
app.stage.addChild(MT_Text);

rocket.target_y = 500

//Miljövariabler
rocket.dnoise_strength = 1
rocket.mass = 5000
rocket.max_thrust = 10000
gravity = 0
rocket.mass = 1000 // kg

app.ticker.add(function(delta) {

    
    // Störningar
    rocket.dnoise = (Math.random() - 0.5) * rocket.dnoise_strength

    //Gravitation
    rocket.gforce_y = rocket.mass * gravity

    // P
    rocket.error_y = rocket.target_y - rocket.y

    // I
    rocket.int_array.push(rocket.error_y);
    rocket.int_array.shift()
    rocket.int_array_windowed = []
    for (let i = 0; i < rocket.int_array_len; i++) {
        rocket.int_array_windowed.push(rocket.int_array[i]*rocket.int_window_array[i])}
    rocket.error_int_y = rocket.int_array_windowed.reduce((a, b) => a + b, 0)  // / rocket.int_array_len

    // D
    rocket.error_deriv_y = (rocket.error_y - rocket.previous_error_y) / seconds_per_frame
    rocket.p_thrust = rocket.error_y * rocket.p_coeff
    rocket.i_thrust = rocket.error_int_y * rocket.i_coeff
    rocket.d_thrust = rocket.error_deriv_y * rocket.d_coeff
    

    // Rocket-Rörelse
    rocket.total_thrust =  rocket.p_thrust + rocket.i_thrust  + rocket.d_thrust;
    rocket.total_thrust = Math.sign(rocket.total_thrust) * Math.min(Math.abs(rocket.total_thrust), rocket.max_thrust)
    rocket.ay = (rocket.gforce_y + rocket.total_thrust + rocket.dnoise) / rocket.mass
    rocket.vy += rocket.ay * seconds_per_frame
    rocket.pvy = rocket.vy * pixels_per_meter
    rocket.y += rocket.pvy

    // target-rörelse
    rocket.target_y += rocket.target_vy
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

    Pk_Text.text='Pk: ' + Math.round(rocket.p_coeff)
    Ik_Text.text='Ik: ' + Math.round(rocket.i_coeff*10) / 10
    Dk_Text.text='Dk: ' + Math.round(rocket.d_coeff,2)

    E_Text.text='Error: ' + Math.round(rocket.error_y)
    G_Text.text='Grav: ' + Math.round(gravity)
    T_Text.text='Turb: ' + Math.round(Math.log10(rocket.dnoise_strength) * 10) / 10
    MT_Text.text='MxThr: ' + rocket.max_thrust
    MT_Text.style = (Math.abs(rocket.total_thrust) < rocket.max_thrust) ? infostyle : estyle
});

app.renderer.plugins.interaction.on('pointerdown', onClick);

function onClick (event) {
    
    rocket.target_y = event.data.global.y;
    
    // sprite.scale.y = event.data.global.y / (app.screen.height / 2);
}

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        } 
    };

    key.upHandler = event => {
        if(event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener("keydown", downListener, false);
    window.addEventListener("keyup", upListener, false);
    
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyip", upListener);
    };

    return key;
}

let wKey = keyboard("w");
wKey.press = () => {
    rocket.p_coeff += 1
}

let WKey = keyboard("W");
WKey.press = () => {
    rocket.p_coeff += 10
}

let qKey = keyboard("q");
qKey.press = () => {
    rocket.p_coeff -= 1
}

let QKey = keyboard("Q");
QKey.press = () => {
    rocket.p_coeff -= 10
}

let aKey = keyboard("a");
aKey.press = () => {
    rocket.i_coeff -= 0.1
}

let AKey = keyboard("A");
AKey.press = () => {
    rocket.i_coeff -= 1
}

let sKey = keyboard("s");
sKey.press = () => {
    rocket.i_coeff += 0.1
}

let SKey = keyboard("S");
SKey.press = () => {
    rocket.i_coeff += 1
}

let zKey = keyboard("z");
zKey.press = () => {
    rocket.d_coeff -= 1
}

let ZKey = keyboard("Z");
ZKey.press = () => {
    rocket.d_coeff -= 10
}

let xKey = keyboard("x");
xKey.press = () => {
    rocket.d_coeff += 1
}

let XKey = keyboard("X");
XKey.press = () => {
    rocket.d_coeff += 10
}

let gKey = keyboard("g");
gKey.press = () => {
    gravity += 1
}

let GKey = keyboard("G");
GKey.press = () => {
    gravity -= 1
}

let tKey = keyboard("t");
tKey.press = () => {
    rocket.dnoise_strength = rocket.dnoise_strength * 3
}

let TKey = keyboard("T");
TKey.press = () => {
    rocket.dnoise_strength = rocket.dnoise_strength / 3
}

let mKey = keyboard("m");
mKey.press = () => {
    rocket.max_thrust += 100
}

let MKey = keyboard("M");
MKey.press = () => {
    rocket.max_thrust += 1000

}

let nKey = keyboard("n");
nKey.press = () => {
    rocket.max_thrust -= 100
    rocket.max_thrust = Math.max(0, rocket.max_thrust)
}

let NKey = keyboard("N");
NKey.press = () => {
    rocket.max_thrust -= 1000
    rocket.max_thrust = Math.max(0, rocket.max_thrust)
}


let upKey = keyboard("ArrowUp");
upKey.press = () => {
    rocket.target_vy = - 10
}
upKey.release = () => {
    if (downKey.isUp) rocket.target_vy = 0
}

let downKey = keyboard("ArrowDown");
downKey.press = () => {
    rocket.target_vy = 10
}
downKey.release = () => {
    if (upKey.isUp) rocket.target_vy = 0
}
