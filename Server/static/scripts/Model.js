﻿var Tx = 100, Ty = 100, Tz = 100;
var Cx = 180, Cy = 180, Cz = 180;
var last = new Date();
var flag = true;
window.onload = function () {
    Update();
};
function $(str) {
    return window.document.getElementById(str);
}
setInterval(function(){myTimer(); },100);
function myTimer()
{
    var now = new Date();
    if((flag == false) || (now.getTime() - last.getTime() < 50))
        return;
    jQuery.ajax({
        type: "POST",
        url: "/",
        data: {
            "Tx": Tx,
            "Ty": Ty,
            "Tz": Tz,
            "Cx": Cx,
            "Cy": Cy,
            "Cz": Cz,
            "P": $("ort").checked
        },
        dataType: "json",
        success: function (data) {
            drawSpatial(data);
        }
    });
    drawComplex();
    flag = false;
}
function Update() {                
    $("x_value").innerHTML = "X: " + $("x_slider").value;
    $("y_value").innerHTML = "Y: " + $("y_slider").value;
    $("z_value").innerHTML = "Z: " + $("z_slider").value;
    if ($("point").checked == true) {
        Tx = $("x_slider").value;
        Ty = $("y_slider").value;
        Tz = $("z_slider").value;
    }
    if ($("camera").checked == true) {
        Cx = $("x_slider").value;
        Cy = $("y_slider").value;
        Cz = $("z_slider").value;
    }
    var now = new Date();
    if(now.getTime() - last.getTime() < 50)
        return;
    jQuery.ajax({
        type: "POST",
        url: "/",
        data: {
            "Tx": Tx,
            "Ty": Ty,
            "Tz": Tz,
            "Cx": Cx,
            "Cy": Cy,
            "Cz": Cz,
            "P": $("ort").checked
        },
        dataType: "json",
        success: function (data) {
            drawSpatial(data);
        }
    });
    drawComplex();
    last = new Date();
    flag = true;
}
        
function drawSpatial(data) {

    var c = $("spatialCanvas").getContext('2d');
    c.clearRect(0, 0, $("spatialCanvas").width, $("spatialCanvas").height);
    c.fillStyle = "#000";
    if(data[10][0] == 0){
        c.fillText('Невозможно построить изображение', 6, 12);
        return;
    }
    c.strokeStyle = "#000";
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(200, 200);
    c.lineTo(data[7][0], data[7][1]);
    c.moveTo(200, 200);
    c.lineTo(data[8][0], data[8][1]);
    c.moveTo(200, 200);
    c.lineTo(data[9][0], data[9][1]);
    c.closePath();
    c.stroke();
            
    c.strokeStyle = "#e00";
    c.beginPath();
    c.moveTo(data[0][0], data[0][1]);
    c.lineTo(data[4][0], data[4][1]);
    c.moveTo(data[0][0], data[0][1]);
    c.lineTo(data[5][0], data[5][1]);
    c.moveTo(data[0][0], data[0][1]);
    c.lineTo(data[6][0], data[6][1]);
    c.closePath();
    c.stroke();
            
    c.strokeStyle = "#436eee";
    c.beginPath();
    c.moveTo(data[4][0], data[4][1]);
    c.lineTo(data[1][0], data[1][1]);
    c.moveTo(data[4][0], data[4][1]);
    c.lineTo(data[2][0], data[2][1]);
    c.moveTo(data[5][0], data[5][1]);
    c.lineTo(data[1][0], data[1][1]);
    c.moveTo(data[5][0], data[5][1]);
    c.lineTo(data[3][0], data[3][1]);
    c.moveTo(data[6][0], data[6][1]);
    c.lineTo(data[2][0], data[2][1]);
    c.moveTo(data[6][0], data[6][1]);
    c.lineTo(data[3][0], data[3][1]);
    c.closePath();
    c.stroke();
            
    c.fillText("X", data[7][0] + 3, data[7][1] + 10);
    c.fillText("Y", data[8][0] + 3, data[8][1] + 10);
    c.fillText("Z", data[9][0] + 3, data[9][1] + 10);
            
    c.fillStyle = "#cd0000";
    c.beginPath();
    c.arc(data[0][0], data[0][1], 3, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.fillText("T", data[0][0] + 3, data[0][1] + 10);
            
    c.fillStyle = "#27408b";
    c.beginPath();
    c.arc(data[4][0], data[4][1], 3, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.fillText("T1", data[4][0] + 3, data[4][1] + 10);
    c.beginPath();
    c.arc(data[5][0], data[5][1], 3, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.fillText("T2", data[5][0] + 3, data[5][1] + 10);
    c.beginPath();
    c.arc(data[6][0], data[6][1], 3, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.fillText("T3", data[6][0] + 3, data[6][1] + 10);
}
        
function drawComplex() {
    var c = $("complexCanvas").getContext('2d');
    c.clearRect(0, 0, $("complexCanvas").width, $("complexCanvas").height);
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(0, 200);
    c.lineTo(400, 200);
    c.moveTo(200, 0);
    c.lineTo(200, 400);
    c.closePath();
    c.stroke();
    c.fillText("X", 3, 196);
    c.fillText("Y", 390, 196);
    c.fillText("Y", 203, 397);
    c.fillText("Z", 203, 10);
    var T1x = 200 - ~~Tx, T1y = 200 + ~~Ty;
    var T2x = 200 - ~~Tx, T2y = 200 - ~~Tz;
    var T3x = 200 + ~~Ty, T3y = 200 - ~~Tz;
    var C1x = 200 - ~~Cx, C1y = 200 + ~~Cy;
    var C2x = 200 - ~~Cx, C2y = 200 - ~~Cz;
    var C3x = 200 + ~~Cy, C3y = 200 - ~~Cz;
    c.strokeStyle = "#e00";
    c.beginPath();
    c.moveTo(200, 200 + ~~Ty);
    c.lineTo(T1x, T1y);
    c.lineTo(T2x, T2y);
    c.lineTo(T3x, T3y);
    c.lineTo(200 + ~~Ty, 200);
    c.arc(200, 200, Ty, 2 * Math.PI, Math.PI / 2);
    c.closePath();
    c.stroke();
    c.strokeStyle = "#436eee";
    c.beginPath();
    c.moveTo(200, 200 + ~~Cy);
    c.lineTo(C1x, C1y);
    c.lineTo(C2x, C2y);
    c.lineTo(C3x, C3y);
    c.lineTo(200 + ~~Cy, 200);
    c.arc(200, 200, Cy, 2 * Math.PI, Math.PI / 2);
    c.closePath();
    c.stroke();
    c.fillStyle = "#cd0000";
    c.beginPath();
    c.arc(T1x, T1y, 3, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.beginPath();
    c.arc(T2x, T2y, 3, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.beginPath();
    c.arc(T3x, T3y, 3, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.fillText("T1", ~~T1x + 3, T1y + 10);
    c.fillText("T2", ~~T2x + 3, T2y + 10);
    c.fillText("T3", ~~T3x + 3, T3y + 10);
    c.fillStyle = "#27408b";
    c.beginPath();
    c.arc(C1x, C1y, 3, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.beginPath();
    c.arc(C2x, C2y, 3, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.beginPath();
    c.arc(C3x, C3y, 3, 0, 2 * Math.PI);
    c.closePath();
    c.fill();
    c.fillText("C1", ~~C1x + 3, C1y + 10);
    c.fillText("C2", ~~C2x + 3, C2y + 10);
    c.fillText("C3", ~~C3x + 3, C3y + 10);
}
function SelectPoint() {
    $("x_slider").value = Tx;
    $("y_slider").value = Ty;
    $("z_slider").value = Tz;
    $("x_value").innerHTML = "X: " + Tx;
    $("y_value").innerHTML = "Y: " + Ty;
    $("z_value").innerHTML = "Z: " + Tz;
}
function SelectCamera() {
    $("x_slider").value = Cx;
    $("y_slider").value = Cy;
    $("z_slider").value = Cz;
    $("x_value").innerHTML = "X: " + Cx;
    $("y_value").innerHTML = "Y: " + Cy;
    $("z_value").innerHTML = "Z: " + Cz;
}