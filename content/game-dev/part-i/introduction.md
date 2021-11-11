+++
title = "Introduction"
weight = 1
+++

---

## Game Dev - Season IV

Welcome to the return of MCPT's Game Dev Series! Over the course of 3 workshops, we have something for everyone, whether you’re a beginner or an experienced coder. Inspired by **Bloons Tower Defense**, you will learn how to code your very own tower-defense game in Processing!

{{< p5js >}}

// Program main method
function setup() {
initializeFields();
createCanvas(800, 500);
loadHeartIcon();
initDragAndDrop();
initPath();
createFirstWave();
}
let started;
let frames = 0;
function draw() {
frames++;
background(color(0xad, 0xd5, 0x58));

    if(!started) {
        const sz = 80 + Math.sin(frames / 10) * 2;
        textSize(sz);
        textAlign(CENTER, CENTER)
        
        rectMode(CENTER);
        noStroke();
        fill(color(0x7b, 0x9d, 0x32));
        rect(400, 250, sz * 9, sz * 2, 50);
        fill(color(0xed, 0xd5, 0x58));
        rect(400, 250, sz * 9 - 30, sz * 2 - 30, 50);
        fill(color(0x4C, 0x67, 0x10));
        text("Click To Start! ", 408, 255);
stroke(color(0x4C, 0x67, 0x10));
        strokeWeight(5);
        noFill();
        rectMode(CORNER);
        rect(0, 0, 800, 500)
        return;
    }
    textAlign(LEFT, BASELINE)
    drawPath();
    // Draw all the towers that have been placed down before
    drawAllTowers();
    drawTrash();
    drawSelectedTowers();
    dragAndDropInstructions();
    drawBalloons();
    drawHealthBar();
    stroke(color(0x4C, 0x67, 0x10));
strokeWeight(5);
noFill();
rectMode(CORNER);
rect(0, 0, 800, 500)
}

// Whenever the user drags the mouse, update the x and y values of the tower
function mouseDragged() {
if (within) {
// Check to see if the user is currently dragging a tower
// Set the values while accounting for the offset
x = mouseX + difX;
y = mouseY + difY;
}
}

// Whenever the user initially presses down on the mouse
function mousePressed() {
if (mouseX < 0 || mouseX > 800 || mouseY < 0 || mouseY > 500) return;
if(!started) started = true;
// Check to see if the pointer is within the bounds of the tower
within = withinBounds();
if (within) {
// The tower has been "picked up"
handlePickUp();
// Calculate the offset values (the mouse pointer may not be in the direct centre of the tower)
difX = x - mouseX;
difY = y - mouseY;
}
}

// Whenever the user releases their mouse
function mouseReleased() {
if (within) {
// If the user was holding the tower in the previous frame, the tower has just been dropped
// Call the method to handle the drop and check for drop validity
handleDrop();
}
// The mouse is no longer holding the tower
within = false;
}

var balloons;

var distanceTravelled, delay, speed;

/*
Encompasses: Displaying Balloons, Waves & Sending Balloons, Balloon Reaching End of Path
*/
function createFirstWave() {
// {Number of "steps" taken, frames of delay before first step, speed}
balloons.push( [ 0, 100, 3 ]);
balloons.push( [ 0, 130, 3 ]);
balloons.push( [ 0, 160, 2 ]);
balloons.push( [ 0, 220, 4 ]);
balloons.push( [ 0, 340, 2 ]);
balloons.push( [ 0, 370, 2 ]);
balloons.push( [ 0, 400, 5 ]);
balloons.push( [ 0, 430, 5 ]);
balloons.push( [ 0, 490, 3 ]);
balloons.push( [ 0, 520, 1 ]);
balloons.push( [ 0, 550, 3 ]);
}

// Displays and moves balloons
function updatePositions(balloon) {
// Only when balloonProps[1] is 0 (the delay) will the balloons start moving.
if (balloon[delay] == 0) {
// Radius of the balloon
var RADIUS = 25;
var position = getLocation(balloon[distanceTravelled]);
// Increases the balloon's total steps by the speed
balloon[distanceTravelled] += balloon[speed];
// Drawing of ballon
ellipseMode(CENTER);
strokeWeight(0);
stroke(0);
fill(color(0xf3, 0xcd, 0x64));
ellipse(position.x, position.y, RADIUS, RADIUS);
} else {
balloon[delay]--;
}
}

function drawBalloons() {
for (var i = 0; i < balloons.length; i++) {
var balloon = balloons[i];
updatePositions(balloon);
if (atEndOfPath(balloon[distanceTravelled])) {
// Removing the balloon from the list
balloons.splice(i, 1);
// Lost a life.
health--;
// Must decrease this counter variable, since the "next" balloon would be skipped
i--;
// When you remove a balloon from the list, all the indexes of the balloons "higher-up" in the list will decrement by 1
}
}
}

// Similar code to distance along path
function atEndOfPath(travelDistance) {
var totalPathLength = 0;
for (var i = 0; i < points.length - 1; i++) {
var currentPoint = points[i];
var nextPoint = points[i + 1];
var distance = dist(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
totalPathLength += distance;
}
// This means the total distance travelled is enough to reach the end
if (travelDistance >= totalPathLength)
return true;
return false;
}

// variable to track user's health
var health;

var heart;

// ------- HP SYSTEM --------
/*
Heath-related variables:
int health: The player's total health.
This number decreases if balloons pass the end of the path (offscreen), currentely 12 since there are 12 balloons.
boolean[] offscreen: this array tracks if the balloon has been subtracted from health once it is off the screen.
PImage heart: the heart icon to display with the healthbar.
*/
function loadHeartIcon() {
// done in preLoad();
}

// method to draw a healthbar at the top right of the screen
function drawHealthBar() {
// draw healthbar outline
stroke(0, 0, 0);
strokeWeight(0);
fill(color(0x83, 0x00, 0x00));
rect(715, 455, 120, 20);
// draw healthbar
noStroke();
rectMode(CORNER);
fill(color(0xFF, 0x31, 0x31));
// the healthbar that changes based on hp
rect(655, 445.5, health * 12, 20);
rectMode(CENTER);
noFill();
// write text
stroke(0, 0, 0);
textSize(14);
fill(255, 255, 255);
text("Health:   " + health, 670, 462);
// put the heart.png image on screen
noFill();
}

// The points on the path, in order.
var points;

var PATH_RADIUS;

/*
Encompasses: The Path for Balloons, Balloon Movement
*/
// ------- CODE FOR THE PATH
function addPointToPath(x, y) {
points.push(new p5.Vector(x, y));
}

function initPath() {
addPointToPath(0, 200);
addPointToPath(50, 200);
addPointToPath(200, 150);
addPointToPath(350, 200);
addPointToPath(500, 150);
addPointToPath(650, 200);
addPointToPath(650, 300);
addPointToPath(500, 250);
addPointToPath(350, 300);
addPointToPath(200, 250);
addPointToPath(50, 300);
addPointToPath(50, 400);
addPointToPath(200, 350);
addPointToPath(350, 400);
addPointToPath(500, 350);
addPointToPath(650, 400);
addPointToPath(800, 350);
}

function drawPath() {
stroke(color(0x4C, 0x67, 0x10));
strokeWeight(PATH_RADIUS * 2 + 1);
for (var i = 0; i < points.length - 1; i++) {
var currentPoint = points[i];
var nextPoint = points[i + 1];
line(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
}
stroke(color(0x7b, 0x9d, 0x32));
strokeWeight(PATH_RADIUS * 2);
for (var i = 0; i < points.length - 1; i++) {
var currentPoint = points[i];
var nextPoint = points[i + 1];
line(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
}
}

// GIVEN TO PARTICIPANTS BY DEFAULT
function getLocation(travelDistance) {
for (var i = 0; i < points.length - 1; i++) {
var currentPoint = points[i];
var nextPoint = points[i + 1];
var distance = dist(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
if (distance <= 0.00000001 || travelDistance >= distance) {
travelDistance -= distance;
} else {
// In between two points
var travelProgress = travelDistance / distance;
var xDist = nextPoint.x - currentPoint.x;
var yDist = nextPoint.y - currentPoint.y;
var x = currentPoint.x + xDist * travelProgress;
var y = currentPoint.y + yDist * travelProgress;
return new p5.Vector(x, y);
}
}
// At end of path
return points[points.length - 1];
}

var x, y, difX, difY, count;

// Towers that are placed down
var towers;

// If mouse was held down during the previous frame
var within;

var towerSize;

var towerColour;

// these variables are the trash bin coordinates
var trashX1, trashY1, trashX2, trashY2;

/*
Encompasses: Displaying Towers, Drag & Drop, Discarding Towers, Rotating Towers, Tower Validity Checking
*/
// -------- CODE FOR DRAG & DROP ----------------------
function initDragAndDrop() {
x = 650;
y = 50;
within = false;
difX = 0;
difY = 0;
trashX1 = 525;
trashY1 = 30;
trashX2 = 775;
trashY2 = 120;
count = 0;
towers = [];
}

// Use point to rectangle collision detection to check for mouse being within bounds of pick-up box
function pointRectCollision(x1, y1, x2, y2, size) {
// --X Distance--               --Y Distance--
return (abs(x2 - x1) <= size / 2) && (abs(y2 - y1) <= size / 2);
}

// Check to see if mouse pointer is within the boundaries of the tower
function withinBounds() {
return pointRectCollision(mouseX, mouseY, x, y, towerSize);
}

// check if you drop in trash
function trashDrop() {
if (x >= trashX1 && x <= trashX2 && y >= trashY1 && y <= trashY2) {
return true;
}
return false;
}

// -------Methods Used for further interaction-------
function handleDrop() {
// Instructions to check for valid drop area will go here
if (trashDrop()) {
x = 650;
y = 50;
print("Dropped object in trash.");
} else if (legalDrop()) {
towers.push(new p5.Vector(x, y));
// Add the tower to the list of placed down towers
x = 650;
y = 50;
print("Dropped for the " + (++count) + "th time.");
}
}

// Will be called whenever a tower is picked up
function handlePickUp() {
print("Object picked up.");
}

// --------------------------------------------------
// Draw a simple tower at a specified location
function drawTowerIcon(xPos, yPos, colour) {
strokeWeight(0);
stroke(0);
fill(colour);
rectMode(CENTER);
// Draw a simple rectangle as the tower
rect(xPos, yPos, towerSize, towerSize);
}

// Draws a tower that rotates to face the targetLocation
function drawTowerIcon(xPos, yPos, colour, targetLocation=null) {
if (targetLocation === null) {
strokeWeight(0);
stroke(0);
fill(colour);
rectMode(CENTER);
// Draw a simple rectangle as the tower
rect(xPos, yPos, towerSize, towerSize);
return;
}
strokeWeight(5);
stroke(color(0x4C, 0x67, 0x10));
line(xPos, yPos, targetLocation.x, targetLocation.y);
push();
translate(xPos, yPos);
// Angle calculation
var slope = (targetLocation.y - yPos) / (targetLocation.x - xPos);
var angle = atan(slope);
rotate(angle);
strokeWeight(0);
fill(colour);
rectMode(CENTER);
// Draw a simple rectangle as the tower
rect(0, 0, towerSize, towerSize);
pop();
}

function drawAllTowers() {
for (var i = 0; i < towers.length; i++) {
var xPos = towers[i].x, yPos = towers[i].y;
// Towers will track the mouse as a placeholder
drawTowerIcon(xPos, yPos, towerColour, new p5.Vector(mouseX, mouseY));
fill(color(0x4C, 0x67, 0x10));
strokeWeight(0);
textSize(12);
text("Tower " + (i + 1), xPos - 30, yPos - 20);
}
}

function drawSelectedTowers() {
// Changing the color if it is an illegal drop to red
if (!legalDrop()) {
// Draw the current tower (that the user is holding) as red to indicate illegal
drawTowerIcon(x, y, color(0xFF, 0x00, 0x00));
} else {
// Draw the current tower (that the user is holding)
drawTowerIcon(x, y, towerColour);
}
// Draw the pick-up tower on the top right
drawTowerIcon(650, 50, towerColour);
}

function drawTrash() {
rectMode(CORNERS);
noStroke();
fill(color(0x4C, 0x67, 0x10));
rect(trashX1, trashY1, trashX2, trashY2);
fill(255, 255, 255);
stroke(255, 255, 255);
}

function dragAndDropInstructions() {
fill(color(0x4C, 0x67, 0x10));
textSize(12);
text("Pick up tower from here!", 620, 20);
text("You can't place towers on the path of the balloons!", 200, 20);
text("Place a tower into the surrounding area to put it in the trash.", 200, 40);
text("Mouse X: " + mouseX + "\nMouse Y: " + mouseY + "\nMouse held: " + mouseIsPressed + "\nWithin object bounds: " + within, 15, 20);
}

// -------- CODE FOR PATH COLLISION DETECTION ---------
function pointDistToLine(start, end, point) {
// Code from https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
// i.e. |w-v|^2 -  avoid a sqrt
var l2 = (start.x - end.x) * (start.x - end.x) + (start.y - end.y) * (start.y - end.y);
// v == w case
if (l2 == 0.0)
return dist(end.x, end.y, point.x, point.y);
var t = max(0, min(1, p5.Vector.sub(point, start).dot(p5.Vector.sub(end, start)) / l2));
// Projection falls on the segment
var projection = p5.Vector.add(start, p5.Vector.mult(p5.Vector.sub(end, start), t));
return dist(point.x, point.y, projection.x, projection.y);
}

function shortestDist(point) {
var answer = Number.MAX_VALUE;
for (var i = 0; i < points.length - 1; i++) {
var start = points[i];
var end = points[i + 1];
var distance = pointDistToLine(start, end, point);
answer = min(answer, distance);
}
return answer;
}

// Will return if a drop is legal by looking at the shortance distance between the rectangle center and the path.
function legalDrop() {
// checking if this tower overlaps any of the already placed towers
for (var i = 0; i < towers.length; i++) {
var towerLocation = towers[i];
if (pointRectCollision(x, y, towerLocation.x, towerLocation.y, towerSize))
return false;
}
return shortestDist(new p5.Vector(x, y)) > PATH_RADIUS;
}

function initializeFields() {
balloons = [];
distanceTravelled = 0;
delay = 1;
speed = 2;
health = 11;
points = [];
PATH_RADIUS = 20;
x = 0;
y = 0;
difX = 0;
difY = 0;
count = 0;
towers = null;
within = false;
towerSize = 25;
towerColour = color(0x7b, 0x9d, 0x32);
trashX1 = 0;
trashY1 = 0;
trashX2 = 0;
trashY2 = 0;
started = false;
}

function preload() {
// TODO: put method calls that load from files into this method
// I found the following calls that you should move here:
// (note that line numbers are from your Processing code)
}
{{< /p5js >}}

{{% expand "What is a tower-defense game?" %}}
{{% notice info %}}

A **tower-defense game** is a type of strategy game where players will place down "towers", usually with a form of in-game currency that will defend against a set of enemies. If you fail to defeat the enemies, you will typically lose health - when you reach zero, it's **Game Over.**

In **Bloons Tower Defense**, the towers are monkeys, and the enemies are balloons, which spawn in rounds and travel along a pre-determined path. Your goal as a player is to strategically spend your currency while placing towers in effective locations, using their special abilities to win the game!

In this workshop, we will cover the fundamental aspects of a tower-defense game, and in future workshops, we will cover special abilities and ways that you can customize your game to make it your own!

{{% /notice %}}
{{% /expand %}}

Everything will be made step-by-step allowing you to learn and see the progress of the game. The speed of the workshop is not set and will be altered at a moment's notice in order, so don’t worry if you don't get everything immediately!

This website is interactive and holds all the content that we will be going over. Flip along and test code just as we do! This site will also be accessible at any time for you to look back and review content.

### Additional Info

{{% expand "What you will learn" %}}
{{% notice info %}}
In the first part of this workshop, you will learn about the logic behind the fundamental components in **each level** of a tower-defense game.

This includes: 
* How to use Lists in Processing for Towers and Balloons
* How to create and customize Paths using a list of coordinates
* How to use Mouse Input to create a Drag-And-Drop System
* How to check if Balloons have reached the end of the path
* How to use pre-built template code
{{% /notice %}}
{{% /expand %}}


{{% expand "What you will need" %}}
{{% notice info %}}

You will need to download [Processing 4.0](https://processing.org/download) from https://processing.org/download, or have Processing 3 or newer installed.

In our workshop, we will be adding code to several **templates**, which you can download below.


{{% /notice %}}
{{%attachments style="blue" title="All Templates" pattern=".*zip"/%}}
{{% /expand %}}



{{% expand "The Game Jam" %}}
{{% notice tip %}}

Ultimately, the Game Dev Series will build up to a week-long Game Jam during the Winter Break. During the Game Jam, you'll develop and create the best game you can!

There will be many prizes and awards so make sure to participate!

In addition, by participating in the Game Dev Series and completing challenges, you will earn points which will help you win awards during the Game Jam.

{{% /notice %}}
{{% /expand %}}

