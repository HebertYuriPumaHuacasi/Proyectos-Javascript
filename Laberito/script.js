var cols, rows = 0;
var gridSize = 40; 
var canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let terminado = false;
let stack = [];
let casillas = [];

/*ctx.shadowColor = "#d53";
ctx.shadowBlur = 12;
ctx.lineJoin = "bevel";
ctx.lineWidth = 1;
ctx.strokeStyle = "#38f";*/


class Casilla {

    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.corners = [
            {x: x*gridSize, y: y*gridSize},
            {x: x*gridSize + gridSize, y: y*gridSize},
            {x: x*gridSize + gridSize, y: y*gridSize + gridSize},
            {x: x*gridSize, y: y*gridSize + gridSize},
            {x: x*gridSize, y: y*gridSize}
        ];
        this.walls = [true,true,true,true];
        this.visited = false;
    }
    
    render() {
        for(let i = 0;i<this.walls.length; i++){
            if(this.walls[i]){
                dibujaLineaBorde(this.corners[i].x, this.corners[i].y, this.corners[i+1].x, this.corners[i+1].y);
            }
        }

        if(this.visted){
            ctx.fillStyle = "green";
            ctx.fillRect(this.x*gridSize, this.y*gridSize, gridSize, gridSize);
        }
    }

    checkvecinos(){
        let x = this.x;
        let y = this.y;
        let posvecinos = [
            {x: x, y: y-1},
            {x: x+1, y: y},
            {x: x, y: y+1},
            {x: x-1, y: y},
        ];

        let vecinos = [];
        for(let i=0;i<posvecinos.length; i++){
            let vecinoBajoChequeo = casillas[indice(posvecinos[i].x,posvecinos[i].y)];

            if(vecinoBajoChequeo && !vecinoBajoChequeo.visited){
                vecinos.push(vecinoBajoChequeo);
            }
        }

        if(vecinos.length>0){
            let nRand = Math.floor(Math.random()*vecinos.length);
            return vecinos[nRand];
        }

        return undefined;
    }

    cursor(){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x*gridSize, this.y*gridSize, gridSize, gridSize);
    }
}

function abrirCamino(actual,elegido){
    lr = actual.x - elegido.x;
    if(lr == -1){
        actual.walls[1] = false;
        elegido.walls[3] = false;
    }
    else if(lr == 1){
        actual.walls[3] = false;
        elegido.walls[1] = false;
    }

    tb = actual.y - elegido.y;
    if(tb == -1){
        actual.walls[2] = false;
        elegido.walls[0] = false;
    }
    else if(tb == 1){
        actual.walls[0] = false;
        elegido.walls[2] = false;
    }
}

function dibujaLineaBorde(x1, y1, x2, y2){
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}

function indice(x,y){
    if(x<0 || y<0 || x > (width/gridSize) -1 || y> (height/gridSize) -1){
        return -1;
    }

    return y*(height/gridSize) + x;
}

function crearArrayCasilla(){
    
    //ctx.clearRect(0, 0, width, height);

    for (let x = 0; x < (width/gridSize); x ++) {
        for (let y = 0; y < (height/gridSize); y ++) {
            let casilla = new Casilla(y,x);
            casillas.push(casilla);
        }
    }
    //print(casillas);
}

crearArrayCasilla();

let elejida;
let actual = casillas[0];
actual.visited = true;
stack.push(actual);

function mazeGenerator(){
    if(stack.length > 0){
        console.log(stack.length);
        ctx.clearRect(0,0,width,height);
        actual = stack.pop();
        elegida = actual.checkvecinos();

        if(elegida){
            elegida.cursor();
            stack.push(actual);
            abrirCamino(actual, elegida);
            elegida.visited = true;
            stack.push(elegida);
        } else {
            actual.cursor();
        }

        for(let i=0; i<casillas.length; i++){
            casillas[i].render();
        }
    } else {
        //dibujarTextos();
        terminado = true;
    }
}

setInterval(mazeGenerator,1000/60);

document.addEventListener("click", (event) => {
    if(event.target.id === 'reset' && terminado) {
        location.reload();
        console.log("hola");
    }
});