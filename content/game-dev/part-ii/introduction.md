+++
title = "Introduction"
weight = 1
+++

---

## Game Dev - Season IV

Welcome to the return of MCPT's Game Dev Series! Over the course of 3 workshops, we have something for everyone, whether you’re a beginner or an experienced coder. Inspired by **Bloons Tower Defense**, you will learn how to code your very own tower-defense game in Processing!
### Demo

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

function draw() {
background(color(0xad, 0xd5, 0x58));
drawPath();
// Draw all the towers that have been placed down before
drawAllTowers();
handleProjectiles();
drawTrash();
drawSelectedTowers();
dragAndDropInstructions();
drawBalloons();
drawHealthBar();
drawBalanceDisplay();
if (health <= 0) {
drawLostAnimation();
}
}

// Whenever the user drags the mouse, update the x and y values of the tower
function mouseDragged() {
if (currentlyDragging !== notDragging) {
dragAndDropLocations[currentlyDragging] = new p5.Vector(mouseX + difX, mouseY + difY);
}
}

// Whenever the user initially presses down on the mouse
function mousePressed() {
for (var i = 0; i < towerCount; i++) {
handlePickUp(i);
}
}

// Whenever the user releases their mouse
function mouseReleased() {
if (currentlyDragging !== notDragging) {
handleDrop(currentlyDragging);
}
currentlyDragging = notDragging;
}

var balloons;

var distanceTravelled, delay, speed, hp, slowed, ID;

// Radius of the balloon
var balloonRadius;

var maxBalloonHP;

/*
Encompasses: Displaying Balloons, Waves & Sending Balloons, Balloon Reaching End of Path
*/
function createFirstWave() {
// {Number of "steps" taken, frames of delay before first step, speed, hp, slowed (0=no, 1=yes)}
for (var i = 0; i <= 100; i++) {
balloons.push([ 0, i * 10 + 100, 3, maxBalloonHP, 0, i ]);
}
}

// Displays and moves balloons
function updatePositions(balloon) {
// Only when balloonProps[1] is 0 (the delay) will the balloons start moving.
if (balloon[delay] === 0) {
var position = getLocation(balloon[distanceTravelled]);
var travelSpeed = balloon[speed];
// Increases the balloon's total steps by the speed
balloon[distanceTravelled] += travelSpeed;
// Drawing of ballon
ellipseMode(CENTER);
strokeWeight(0);
stroke(0);
fill(0);
if (balloon[hp] < maxBalloonHP) {
// draw healthbar outline
stroke(0, 0, 0);
strokeWeight(0);
rectMode(CORNER);
fill(color(0x83, 0x00, 0x00));
var hbLength = 35, hbWidth = 6;
rect(position.x - hbLength / 2, position.y - (balloonRadius), hbLength, hbWidth);
// draw mini healthbar
noStroke();
fill(color(0xFF, 0x31, 0x31));
// the healthbar that changes based on hp
rect(position.x - hbLength / 2, position.y - (balloonRadius), hbLength * (balloon[hp] / maxBalloonHP), hbWidth);
noFill();
// write text
stroke(0, 0, 0);
textSize(14);
fill(255, 255, 255);
text("Health:   " + health, 670, 462);
}
fill(color(0xf3, 0xcd, 0x64));
if (balloon[slowed] === 1) {
fill(color(0xC1, 0x9D, 0x40));
}
ellipse(position.x, position.y, balloonRadius, balloonRadius);
} else {
balloon[delay]--;
}
}

function drawBalloons() {
for (var i = 0; i < balloons.length; i++) {
var balloon = balloons[i];
updatePositions(balloon);
if (balloon[hp] <= 0) {
handleBalloonPop();
balloons.splice(i, 1);
i--;
continue;
}
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
This number decreases if balloons pass the end of the path (offscreen), currentely 11 since there are 11 balloons.
PImage heart: the heart icon to display with the healthbar.
*/
function loadHeartIcon() {
//heart = loadImage("heart.png");
}

// method to draw a healthbar at the bottom right of the screen
function drawHealthBar() {
// draw healthbar outline
stroke(0, 0, 0);
strokeWeight(0);
fill(color(0x83, 0x00, 0x00));
rectMode(CENTER);
rect(721, 455, 132, 20);
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
imageMode(CENTER);
image(heart, 650, 456);
noFill();
}

// Give the user $750 of starting balance
var currentBalance;

// Money earned by popping a balloon
var rewardPerBalloon;

/**
* Currency system for tower defense
*  - Rewards player for popping balloon
*  - Keeps track of balance
*  - Checks for sufficient funds when purchasing tower
     */
     // Current amount of money owned by the player
     function handleBalloonPop() {
     // Reward the player for popping the balloon
     increaseBalance(rewardPerBalloon);
     }

function increaseBalance(amount) {
// Increase the current balance by the amount given
currentBalance += amount;
}

/**
* Checks to see if there is sufficient balance for purchasing a certain item
*  Parameter "cost" is the cost of the tower to be purchased
   */
   function hasSufficientFunds(cost) {
   if (currentBalance < cost) {
   // Not enough money to purchase the tower
   return false;
   } else {
   // Enough money to purchase the tower
   return true;
   }
   }

/**
* Purchases a tower
*  Parameter "cost" is the cost of the tower to be purchased
   */
   function purchaseTower(cost) {
   currentBalance -= cost;
   }

// Checks to see if the user is attempting to purchase/pick up a tower but has insufficient funds
function attemptingToPurchaseTowerWithoutFunds(towerID) {
if (mouseIsPressed && withinBounds(towerID) && !hasSufficientFunds(towerPrice[towerID])) {
return true;
} else {
return false;
}
}

// Displays the user's current balance on the screen
function drawBalanceDisplay() {
// If the user is attempting to purchase a tower without funds, warn them with red display text
var error = false;
for (var i = 0; i < towerCount; i++) {
if (attemptingToPurchaseTowerWithoutFunds(i)) {
error = true;
}
}
if (error) {
fill(towerErrorColour);
} else {
// Black text
fill(0);
}
text("Current Balance: $" + currentBalance, 336, 65);
}

// -1 = not holding any tower, 0 = within default, 1 = within eight, 2 = within slow
var currentlyDragging;

var notDragging;

var difX, difY, count;

var held;

var towerPrice;

var towerColours;

// Constant, "copy" array to store where the towers are supposed to be
var originalLocations;

// Where the currently dragged towers are
var dragAndDropLocations;

// Towers that are placed down
var towers;

var towerSize;

// Colour to display when user purchases tower without sufficient funds
var towerErrorColour;

// these variables are the trash bin coordinates
var trashX1, trashY1, trashX2, trashY2;

/*
Encompasses: Displaying Towers, Drag & Drop, Discarding Towers, Rotating Towers, Tower Validity Checking
*/
// -------- CODE FOR DRAG & DROP ----------------------
// final color
function initDragAndDrop() {
difX = 0;
difY = 0;
trashX1 = 525;
trashY1 = 30;
trashX2 = 775;
trashY2 = 120;
count = 0;
towers = [];
towerData = [];
}

// Use point to rectangle collision detection to check for mouse being within bounds of pick-up box
function pointRectCollision(x1, y1, x2, y2, size) {
// --X Distance--               --Y Distance--
return (Math.abs(x2 - x1) <= size / 2) && (Math.abs(y2 - y1) <= size / 2);
}

function withinBounds(towerID) {
var towerLocation = dragAndDropLocations[towerID];
return pointRectCollision(mouseX, mouseY, towerLocation.x, towerLocation.y, towerSize);
}

// check if you drop in trash
function trashDrop(towerID) {
var location = dragAndDropLocations[towerID];
if (location.x < 0 || location.x > 800 || location.y < 0 || location.y > 500)
return true;
if (location.x >= trashX1 && location.x <= trashX2 && location.y >= trashY1 && location.y <= trashY2)
return true;
return false;
}

// -------Methods Used for further interaction-------
function handleDrop(towerID) {
// Instructions to check for valid drop area will go here
if (trashDrop(towerID)) {
dragAndDropLocations[towerID] = originalLocations[towerID];
held[towerID] = false;
print("Dropped object in trash.");
} else if (legalDrop(towerID)) {
towers.push(dragAndDropLocations[towerID].copy());
towerData.push(makeTowerData(towerID));
dragAndDropLocations[towerID] = originalLocations[towerID];
held[towerID] = false;
purchaseTower(towerPrice[towerID]);
print("Dropped for the " + (++count) + "th time.");
}
}

// Will be called whenever a tower is picked up
function handlePickUp(pickedUpTowerID) {
if (withinBounds(pickedUpTowerID) && hasSufficientFunds(towerPrice[pickedUpTowerID])) {
currentlyDragging = pickedUpTowerID;
held[currentlyDragging] = true;
var location = dragAndDropLocations[pickedUpTowerID];
// Calculate the offset values (the mouse pointer may not be in the direct centre of the tower)
difX = parseInt(location.x) - mouseX;
difY = parseInt(location.y) - mouseY;
}
print("Object picked up.");
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
text("Mouse X: " + mouseX + "\nMouse Y: " + mouseY + "\nMouse held: " + mouseIsPressed + "\nTower Held: " + currentlyDragging, 15, 20);
}

// -------- CODE FOR PATH COLLISION DETECTION ---------
function pointDistToLine(start, end, point) {
// Code from https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
// i.e. |w-v|^2 -  avoid a sqrt
var l2 = (start.x - end.x) * (start.x - end.x) + (start.y - end.y) * (start.y - end.y);
// v === w case
if (l2 === 0.0)
return dist(end.x, end.y, point.x, point.y);
var t = Math.max(0, Math.min(1, p5.Vector.sub(point, start).dot(p5.Vector.sub(end, start)) / l2));
// Projection falls on the segment
var projection = p5.Vector.add(start, p5.Vector.mult(p5.Vector
.sub(end, start), t));
return dist(point.x, point.y, projection.x, projection.y);
}

function shortestDist(point) {
var answer = Number.MAX_VALUE;
for (var i = 0; i < points.length - 1; i++) {
var start = points[i];
var end = points[i + 1];
var distance = pointDistToLine(start, end, point);
answer = Math.min(answer, distance);
}
return answer;
}

// Will return if a drop is legal by looking at the shortest distance between the rectangle center and the path.
function legalDrop(towerID) {
var heldLocation = dragAndDropLocations[towerID];
// checking if this tower overlaps any of the already placed towers
for (var i = 0; i < towers.length; i++) {
var towerLocation = towers[i];
if (pointRectCollision(heldLocation.x, heldLocation.y, towerLocation.x, towerLocation.y, towerSize))
return false;
}
return shortestDist(heldLocation) > PATH_RADIUS;
}

var framesSinceLost;

function drawLostAnimation() {
framesSinceLost++;
var alpha = 166 * framesSinceLost / 80;
if (alpha > 166)
alpha = 166;
fill(127, alpha);
rectMode(CORNER);
noStroke();
rect(0, 0, 800, 500);
var textAlpha = 255 * (framesSinceLost - 80) / 80;
if (textAlpha > 255)
;
textAlpha = 255;
fill(255, textAlpha);
textSize(70);
text("YOU LOST...", 265, 260);
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

var dp;

// GIVEN TO PARTICIPANTS BY DEFAULT
function getLocation(travelDistance) {
var memoized = dp[travelDistance];
if (memoized !== undefined) {
return memoized;
}
var originalDist = travelDistance;
for (var i = 0; i < points.length - 1; i++) {
var currentPoint = points[i];
var nextPoint = points[i + 1];
var distance = dist(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
if (distance <= 0.000000001 || travelDistance >= distance) {
travelDistance -= distance;
} else {
// In between two points
var travelProgress = travelDistance / distance;
var xDist = nextPoint.x - currentPoint.x;
var yDist = nextPoint.y - currentPoint.y;
var x = currentPoint.x + xDist * travelProgress;
var y = currentPoint.y + yDist * travelProgress;
dp[originalDist] = new p5.Vector(x, y);
return new p5.Vector(x, y);
}
}
// At end of path
dp[originalDist] = points[points.length - 1];
return points[points.length - 1];
}

var center, velocity;

var projectileData;

var balloonsHit;

var damage, pierce, angle, currDistTravelled, maxDistTravelled, thickness, dmgType;

var projectileRadius;

function createProjectile(centre, vel, damage, pierce, maxDistTravelled, thickness, dmgType) {
balloonsHit.push([]);
center.push(centre);
velocity.push(vel);
var angle = atan2(vel.y, vel.x);
projectileData.push([ damage, pierce, angle, 0, maxDistTravelled, thickness, dmgType ]);
}

function distToProjectile(projectileID, point) {
var data = projectileData[projectileID];
var width = cos(data[angle]), height = sin(data[angle]);
var displacement = new p5.Vector(width, height).mult(projectileRadius);
if (data[dmgType] === laser)
displacement.mult(1000);
var start = p5.Vector.add(center[projectileID], displacement), end = p5.Vector.sub(center[projectileID], displacement);
if (data[dmgType] === laser)
end = center[projectileID];
return pointDistToLine(start, end, point);
}

function dead(projectileID) {
var data = projectileData[projectileID];
return offScreen(projectileID) || data[pierce] === 0 || data[currDistTravelled] > data[maxDistTravelled];
}

function offScreen(projectileID) {
return center[projectileID].x < 0 || center[projectileID].x > 800 || center[projectileID].y < 0 || center[projectileID].y > 500;
}

function drawProjectile(projectileID) {
var data = projectileData[projectileID];
stroke(255);
strokeWeight(data[thickness]);
var width = cos(data[angle]), height = sin(data[angle]);
var displacement = new p5.Vector(width, height).mult(projectileRadius);
if (data[dmgType] === laser)
displacement.mult(1000);
var start = p5.Vector.add(center[projectileID], displacement), end = p5.Vector.sub(center[projectileID], displacement);
if (data[dmgType] === laser)
end = center[projectileID];
line(start.x, start.y, end.x, end.y);
handleCollision(projectileID);
if (data[dmgType] !== laser)
center[projectileID] = p5.Vector.add(center[projectileID], velocity[projectileID]);
if (data[dmgType] !== laser)
data[currDistTravelled] += velocity[projectileID].mag();
else
data[currDistTravelled]++;
}

function hitBalloon(projectileID, balloonData) {
var data = projectileData[projectileID];
if (data[pierce] === 0 || balloonsHit[projectileID].includes(parseInt(balloonData[ID])))
return;
data[pierce]--;
balloonData[hp] -= data[damage];
if (data[dmgType] === slow && balloonData[slowed] === 0) {
balloonData[speed] *= 0.7;
balloonData[slowed] = 1;
}
balloonsHit[projectileID].push(parseInt(balloonData[ID]));
}

function handleCollision(projectileID) {
var data = projectileData[projectileID];
for (var b in balloons) {
var balloon = balloons[b];
// If the balloon hasn't entered yet, don't count it
if (balloon[delay] !== 0)
continue;
var position = getLocation(balloon[distanceTravelled]);
if (distToProjectile(projectileID, position) <= balloonRadius / 2 + data[thickness] / 2) {
hitBalloon(projectileID, balloon);
}
}
}

// -------------------------------- PROJECTILE CREATION (Participants will NOT be required to code the stuff above this line) -----------------------------------
function track(towerLocation, vision) {
var maxDist = 0;
var location = undefined;
for (var b in balloons) {
var balloon = balloons[b]
var balloonLocation = getLocation(balloon[distanceTravelled]);
// Checks if the tower can see the balloon
if (dist(balloonLocation.x, balloonLocation.y, towerLocation.x, towerLocation.y) <= vision) {
// If the balloon has travelled further than the previously stored one, it is now the new fastest
if (balloon[distanceTravelled] > maxDist) {
location = balloonLocation;
maxDist = balloon[distanceTravelled];
}
}
}
return location;
}

function handleProjectiles() {
for (var i = 0; i < towers.length; i++) {
var location = towers[i];
var data = towerData[i];
data[cooldownRemaining]--;
var balloon = track(location, data[towerVision]);
if (data[projectileType] === laser)
balloon = new p5.Vector(mouseX, mouseY);
// Cooldown is 0 and there is a balloon that the tower tracks shoots a projectile
if (data[cooldownRemaining] <= 0 && balloon !== undefined) {
// Resets the cooldown
data[cooldownRemaining] = data[maxCooldown];
var toMouse = new p5.Vector(balloon.x - location.x, balloon.y - location.y);
if (data[projectileType] === 0) {
var speed = 24, damage = 4, pierce = 1, maxTravelDist = 500, thickness = 4;
var unitVector = p5.Vector.div(toMouse, toMouse.mag());
var ve = p5.Vector.mult(unitVector, speed);
createProjectile(location, ve, damage, pierce, maxTravelDist, thickness, def);
// Default type
} else if (data[projectileType] === 1) {
// Spread in 8
for (var j = 0; j < 8; j++) {
var speed = 12, damage = 3, pierce = 2, maxTravelDist = 150, thickness = 4;
var angle = (PI * 2) * j / 8;
var unitVector = p5.Vector.div(toMouse, toMouse.mag());
var ve = p5.Vector.mult(unitVector, speed).rotate(angle);
createProjectile(location, ve, damage, pierce, maxTravelDist, thickness, eight);
}
} else if (data[projectileType] === 2) {
// glue gunner - slows balloons
// slow-ish speed, low damage, high pierce, low range
var speed = 15, damage = 1, pierce = 7, maxTravelDist = 220, thickness = 4;
var unitVector = p5.Vector.div(toMouse, toMouse.mag());
var ve = p5.Vector.mult(unitVector, speed);
createProjectile(location, ve, damage, pierce, maxTravelDist, thickness, slow);
} else if (data[projectileType] === 3) {
// speed & travel dist are custom, maxTravelDist basically acts like a counter
var speed = 1, pierce = 50, maxTravelDist = data[maxCooldown], thickness = 32;
var damage = 0.10;
var unitVector = p5.Vector.div(toMouse, toMouse.mag());
var ve = p5.Vector.mult(unitVector, speed);
createProjectile(location, ve, damage, pierce, maxTravelDist, thickness, laser);
}
}
}
for (var i = 0; i < projectileData.length; i++) {
drawProjectile(i);
if (dead(i)) {
projectileData.splice(i, 1);
center.splice(i, 1);
velocity.splice(i, 1);
balloonsHit.splice(i, 1);
i--;
}
}
}

var cooldownRemaining, maxCooldown, towerVision, projectileType;

var def, eight, slow, laser;

var towerCount;

var towerData;

var towerVisions;

/*
Encompasses: Displaying Towers & Tower Data (for projectiles)
*/
function makeTowerData(towerID) {
if (towerID === def) {
return [ // Cooldown between next projectile
10, // Max cooldown
10, // Tower Vision
towerVisions[def], // Projectile ID
0 ];
} else if (towerID === eight) {
return [ // Cooldown between next projectile
25, // Max cooldown
25, // Tower Vision
towerVisions[eight], // Projectile ID
1 ];
} else if (towerID === slow) {
return [ 35, 35, // Tower Vision
towerVisions[slow], 2 ];
} else if (towerID === laser) {
return [ 1, 1, towerVisions[laser], 3 ];
}
// filler since we need to return something
return [];
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
function drawTowerWithRotation(xPos, yPos, colour, targetLocation) {
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
var data = towerData[i];
var towerType = data[projectileType];
var track1 = track(towers[i], data[towerVision]);
if (data[projectileType] === laser)
track1 = new p5.Vector(mouseX, mouseY);
if (track1 === undefined) {
drawTowerIcon(xPos, yPos, towerColours[towerType]);
} else {
drawTowerWithRotation(xPos, yPos, towerColours[towerType], new p5.Vector(track1.x, track1.y));
}
if (pointRectCollision(mouseX, mouseY, xPos, yPos, towerSize)) {
// Drawing the tower range visually
fill(127, 80);
stroke(127);
strokeWeight(4);
ellipseMode(RADIUS);
ellipse(xPos, yPos, data[towerVision], data[towerVision]);
}
fill(color(0x4C, 0x67, 0x10));
strokeWeight(0);
textSize(12);
text("Tower " + (i + 1), xPos - 30, yPos - 20);
}
}

function drawSelectedTowers() {
// Note that more than one tower can be dragged at a time
for (var towerID = 0; towerID < towerCount; towerID++) {
if (held[towerID]) {
var location = dragAndDropLocations[towerID];
if (!legalDrop(towerID)) {
drawTowerIcon(location.x, location.y, color(0xFF, 0x00, 0x00));
} else {
drawTowerIcon(location.x, location.y, towerColours[towerID]);
}
// Drawing the tower range of the selected towers
fill(127, 80);
stroke(127);
strokeWeight(4);
ellipseMode(RADIUS);
ellipse(location.x, location.y, towerVisions[towerID], towerVisions[towerID]);
}
}
// Draws the default towers
for (var towerType = 0; towerType < towerCount; towerType++) {
var location = originalLocations[towerType];
if (attemptingToPurchaseTowerWithoutFunds(towerType)) {
drawTowerIcon(location.x, location.y, towerErrorColour);
} else
drawTowerIcon(location.x, location.y, towerColours[towerType]);
fill(255);
textSize(14);
var textOffsetX = -15, textOffsetY = 26;
// displays the prices of towers
text("$" + towerPrice[towerType], location.x + textOffsetX, location.y + textOffsetY);
}
}

function initializeFields() {
balloons = [];
distanceTravelled = 0;
delay = 1;
speed = 2;
hp = 3;
slowed = 4;
ID = 5;
balloonRadius = 25;
maxBalloonHP = 50;
health = 11;
currentBalance = 750;
rewardPerBalloon = 15;
currentlyDragging = -1;
notDragging = -1;
difX = 0;
difY = 0;
count = 0;
held = [ false, false, false, false ];
towerPrice = [ 100, 200, 200, 400 ];
towerColours = [ color(0x7b, 0x9d, 0x32), color(0xF0, 0x98, 0xD7), color(0x82, 0xE5, 0xF7), color(0xEA, 0x0C, 0x0C) ];
originalLocations = [ new p5.Vector(600, 50), new p5.Vector(650, 50), new p5.Vector(700, 50), new p5.Vector(750, 50) ];
dragAndDropLocations = [ new p5.Vector(600, 50), new p5.Vector(650, 50), new p5.Vector(700, 50), new p5.Vector(750, 50) ];
towers = null;
towerSize = 25;
towerErrorColour = color(0xE3, 0x07, 0x07);
trashX1 = 0;
trashY1 = 0;
trashX2 = 0;
trashY2 = 0;
framesSinceLost = 0;
points = [];
PATH_RADIUS = 20;
dp = [];
center = [];
velocity = [];
projectileData = [];
balloonsHit = [];
damage = 0;
pierce = 1;
angle = 2;
currDistTravelled = 3;
maxDistTravelled = 4;
thickness = 5;
dmgType = 6;
projectileRadius = 11;
cooldownRemaining = 0;
maxCooldown = 1;
towerVision = 2;
projectileType = 3;
def = 0;
eight = 1;
slow = 2;
laser = 3;
towerCount = 4;
towerData = null;
towerVisions = [ 200, 100, 100, 300 ];
}

function preload() {
// TODO: put method calls that load from files into this method
heart = loadImage("https://raw.githubusercontent.com/mcpt/game-dev/main/PartOne/data/heart.png");
// I found the following calls that you should move here:
// - on line 161: heart = loadImage("heart.png")
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

{{% /expand %}}



{{% expand "The Game Jam" %}}
{{% notice tip %}}

Ultimately, the Game Dev Series will build up to a week-long Game Jam during the Winter Break. During the Game Jam, you'll develop and create the best game you can!

There will be many prizes and awards so make sure to participate!

In addition, by participating in the Game Dev Series and completing challenges, you will earn points which will help you win awards during the Game Jam.

{{% /notice %}}
{{% /expand %}}

