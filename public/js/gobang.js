var canvas = document.getElementById('canvas'),
    ctn = canvas.getContext('2d');


var isWhite = false;   // 是否轮到白棋走
var isWell = false;  // 是否赢了

var imgBlack = new Image();
imgBlack.src = 'black.png';
var imgWhite = new Image();
imgWhite.src = 'white.png';

var chessData = []; 

init();
//初始化棋盘

var socket = io();

function init() {
    for (var i = 0; i <= 640; i += 40) {
        //绘制横线
        ctn.beginPath();
        ctn.moveTo(0, i);
        ctn.lineTo(640, i);
        ctn.closePath();
        ctn.stroke();
        //绘制竖线
        ctn.beginPath();
        ctn.moveTo(i, 0);
        ctn.lineTo(i, 640);
        ctn.closePath();
        ctn.stroke();
    }
    //初始化棋盘数组
    for (var x = 0; x < 15; x++) {
        chessData[x] = [];
        for (var y = 0; y < 15; y++) {
            chessData[x][y] = 0;
        }
    }
};


function play(e) {
    var x = parseInt((e.clientX - 25) / 40);
    var y = parseInt((e.clientY - 25) / 40);
    var step = {
        "which" : isWhite,
        "x" : x,
        "y" : y
    };
    console.log(e.clientX,e.clientY);
    console.log(x,y);

    socket.emit('play',step);
    socket.emit('turn');

    if (chessData[x][y] != 0) {
        alert('你不能在这个位置下棋');
        return;
    }

    if (isWell) {
        alert('游戏已经结束，请刷新重玩！');
        return;
    }
}

function drawChess(chess, x, y) {
    if(isWell){
        return;
    }

    if (x >= 0 && x < 15 && y >= 0 && y < 15) {
        if (chess) {
            ctn.drawImage(imgWhite, x * 40 + 20, y * 40 + 20);
            chessData[x][y] = 1;
        } else {
            ctn.drawImage(imgBlack, x * 40 + 20, y * 40 + 20);
            chessData[x][y] = 2;
        }
    }
}

function judge(chess, x, y) {
    var lr = 0;
    var ve = 0;
    var nw = 0;
    var ne = 0;
    //判断左右
    for (var i = x; i > 0; i--) {
        if (chessData[i][y] != chess) {
            break;
        }
        lr++;
    }
    for (var i = x + 1; i < 15; i++) {
        if (chessData[i][y] != chess) {
            break;
        }
        lr++;
    }
    //判断上下
    for (var i = y; i > 0; i--) {
        if (chessData[x][i] != chess) {
            break;
        }
        ve++;
    }
    for (var i = y + 1; i < 15; i++) {
        if (chessData[x][i] != chess) {
            break;
        }
        ve++
    }
    //判断左上右下
    for (var i = x, j = y; i > 0, j > 0; i--, j--) {
        if (chessData[i][j] != chess) {
            break;
        }
        nw++;
    }
    for (var i = x + 1, j = y + 1; i < 15, j < 15; i++, j++) {
        if (chessData[i][j] != chess) {
            break;
        }
        nw++;
    }
    //判断右上左下
    for (var i = x, j = y; i >= 0, j < 15; i--, j++) {
        if (chessData[i][j] != chess) {
            break;
        }
        ne++;
    }
    for (var i = x + 1, j = y - 1; i < 15, j >= 0; i++, j--) {
        if (chessData[i][j] != chess) {
            break;
        }
        ne++;
    }

    if (lr >= 5 || ve >= 5 || nw >= 5 || ne >= 5) {
        if (chess == 1) {
            isWell = true;
            alert('白棋赢了');
        } else {
            isWell = true;
            alert('黑棋赢了');
        }
    }
}

function playHandle(e){
    play(e);
}

function turnOperate(stat){

    console.log(stat);

    if(stat == isWhite){
        $('canvas').on('mousedown',playHandle);
    }else{
        $('canvas').off('mousedown');
    }

}

socket.on('connect',function(){

	socket.emit('join',prompt('what is your username'));

});


socket.on('whoTurnControl' , function(White){
    isWhite = White;
    alert('im white');
}); 



socket.on('begin' , function(stat){

    if(stat == true){
        document.getElementById('canvas').style.display = 'block';
    };

    if(isWhite){
        socket.emit('turn');
    }

});

socket.on('drawchess',function(step){
    drawChess(step.which, step.x , step.y);
    if(step.which){
        judge(1 , step.x , step.y);
    }else{
        judge(2 , step.x , step.y);
    }
});

socket.on('yourTurn',function(turn){
    switch (turn){
        case true:
          turnOperate(true);
          break;
        case false:
          turnOperate(false);
          break;
    };
});

socket.on('disconnection',function(){
    alert('someone leave');
});


