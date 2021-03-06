
// Program main method
function setup() {
    initializeFields();
    createCanvas(800, 500);

    initDragAndDrop();
    initPath();
    createWaves();
}
let started;
let frames = 0;

function draw() {
    frames++;
    background(color(0xad, 0xd5, 0x58));

    if(!started) {
        const sz = 40 + Math.sin(frames / 15);
        textSize(sz);
        textAlign(CENTER, CENTER)

        rectMode(CENTER);
        noStroke();
        fill(color(0xed, 0xd7, 0x60));
        rect(400, 250, sz * 9, sz * 2, 50);
        fill(color(0xfd, 0xe7, 0x70));
        rect(400, 250, sz * 9 - 10, sz * 2 - 10, 50);
        fill(color(0x4C, 0x67, 0x10));
        text("click to start! ", 408, 255);
        return;
    }
    textAlign(LEFT, BASELINE)
    background(color(0xad, 0xd5, 0x58));
    drawPath();
    // Draw all the towers that have been placed down before
    drawAllTowers();
    handleProjectiles();
    drawTrash();
    drawSelectedTowers();
    dragAndDropInstructions();
    drawCurrentSpikeIcon();
    displayPowerups();
    drawAllSpikes();
    handleSlowdown();
    handleSpeedBoost();
    if (playingLevel) {
        drawBalloons();
    }
    drawHealthBar();
    drawBalanceDisplay();
    drawNextLevelButton();
    drawTowerUI();
    /*
  //upgrading towers implementation
  drawUpgrade();
  upgradeCheck();

  //removing towers implementation
  drawRemove();
  removeCheck();
  */
    towerClickCheck();
    drawRange();
    if (health <= 0) {
        drawLostAnimation();
    }
}

// Whenever the user drags the mouse, update the x and y values of the tower
function mouseDragged() {
    if (currentlyDragging != notDragging) {
        dragAndDropLocations[currentlyDragging] = new p5.Vector(mouseX + difX, mouseY + difY);
    }
    if (spikeHeld) {
        spikeLocation = new p5.Vector(mouseX + difX, mouseY + difY);
    }
}

// Whenever the user initially presses down on the mouse
function mousePressed() {
    started = true;
    for (var i = 0; i < towerCount; i++) {
        handlePickUp(i);
    }
    handleSpikePickUp();
    handleSlowdownPress();
    handleSpeedBoostPress();
    handleNextLevel();
}

// Whenever the user releases their mouse
function mouseReleased() {
    if (currentlyDragging != notDragging) {
        handleDrop(currentlyDragging);
    }
    currentlyDragging = notDragging;
    if (spikeHeld) {
        handleSpikeDrop();
    }
}

var levels;

var balloons;

var distanceTravelled, delay, speed, maxHP, hp, slowed, ID;

// Radius of the balloon
var balloonRadius;

var levelNum;

var playingLevel;

/*
Encompasses: Displaying Balloons, Waves & Sending Balloons, Balloon Reaching End of Path
*/
function createWaves() {
    createLevels(2);
    // (level balloons are for, number of balloons, first balloon delay, delay between the sequence of balloons, speed, hp)
    createBalloons(0, 5, 0, 20, 1, 20);
    createBalloons(0, 100, 30, 20, 2, 60);
    createBalloons(0, 1, 2020, 0, 0.6, 1000);
    createBalloons(1, 5, 0, 20, 1, 100);
}

function createLevels(num) {
    for (var i = 0; i < num; i++) {
        levels.push([]);
    }
}

function createBalloons(level, numBalloons, delay, delayInBetween, speed, hp) {
    for (var i = 0; i < numBalloons; i++) {
        console.log(level + " " + (delay + i * delayInBetween));
        levels[level].push( [ 0, delay + i * delayInBetween, speed, hp, hp, 0, levels[level].length ]);
    }
}

// Displays and moves balloons
function updatePositions(balloon) {
    // Only when balloonProps[1] is 0 (the delay) will the balloons start moving.
    if (balloon[delay] < 0) {
        var position = getLocation(balloon[distanceTravelled]);
        // Slow down the balloon if the slowdown powerup is engaged
        var travelSpeed = balloon[speed] * slowdownAmount;
        // Increases the balloon's total steps by the speed
        balloon[distanceTravelled] += travelSpeed;
        // Drawing of ballon
        ellipseMode(CENTER);
        strokeWeight(0);
        stroke(0);
        fill(0);
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
        rect(position.x - hbLength / 2, position.y - (balloonRadius), hbLength * (balloon[hp] / balloon[maxHP]), hbWidth);
        noFill();
        // write text
        stroke(0, 0, 0);
        textSize(14);
        fill(255, 255, 255);
        strokeWeight(0);
        text("Health:   " + health, 670, 462);
        fill(color(0xf3, 0xcd, 0x64));
        if (balloon[slowed] == 1) {
            fill(color(0xC1, 0x9D, 0x40));
        }
        ellipse(position.x, position.y, balloonRadius, balloonRadius);
    } else {
        balloon[delay]--;
    }
}

function drawBalloons() {
    balloons = levels[levelNum];
    for (var i = 0; i < balloons.length; i++) {
        var balloon = balloons[i];
        updatePositions(balloon);
        var position = getLocation(balloon[distanceTravelled]);
        if (balloonSpikeCollision(position)) {
            handleBalloonPop();
            balloons.splice(i, 1);
            i--;
            continue;
        }
        if (balloon[hp] <= 0) {
            handleBalloonPop();
            balloons.splice(i, 1);
            i--;
            continue;
        }
        if (balloon[distanceTravelled] >= pathLength) {
            // Removing the balloon from the list
            balloons.splice(i, 1);
            // Lost a life.
            health--;
            // Must decrease this counter variable, since the "next" balloon would be skipped
            i--;
            // When you remove a balloon from the list, all the indexes of the balloons "higher-up" in the list will decrement by 1
        }
    }
    if (balloons.length == 0 && playingLevel) {
        playingLevel = false;
        handleWaveReward(levelNum + 1);
    }
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
    heart = loadImage("https://raw.githubusercontent.com/mcpt/game-dev/main/PartThree/data/heart.png");
}

// method to draw a healthbar at the bottom right of the screen
function drawHealthBar() {
    // draw healthbar outline
    stroke(0, 0, 0);
    strokeWeight(0);
    fill(color(0x83, 0x00, 0x00));
    rectMode(CENTER);
    rect(721, 455, 132, 20);
    var trueHealth = max(health, 0);
    // draw healthbar
    noStroke();
    rectMode(CORNER);
    fill(color(0xFF, 0x31, 0x31));
    // the healthbar that changes based on hp
    rect(655, 445.5, trueHealth * 12, 20);
    rectMode(CENTER);
    noFill();
    // write text
    stroke(0, 0, 0);
    textSize(14);
    fill(255, 255, 255);
    text("Health:   " + trueHealth, 670, 462);
    // put the heart.png image on screen
    imageMode(CENTER);
    image(heart, 650, 456);
    noFill();
}

// Next level Button
function pointRectCollision(x1, y1, x2, y2, sizeX, sizeY) {
    // --X Distance--               --Y Distance--
    return (Math.abs(x2 - x1) <= sizeX / 2) && (Math.abs(y2 - y1) <= sizeY / 2);
}

function handleNextLevel() {
    var center = new p5.Vector(100, 400);
    var lengths = new p5.Vector(100, 100);
    if (!playingLevel && pointRectCollision(mouseX, mouseY, center.x, center.y, lengths.x, lengths.y) && levelNum < levels.length - 1) {
        playingLevel = true;
        levelNum++;
    }
}

function drawNextLevelButton() {
    var center = new p5.Vector(60, 425);
    var lengths = new p5.Vector(100, 70);
    fill(0, 150, 0);
    if (playingLevel) {
        fill(0, 150, 0, 100);
    }
    rect(center.x, center.y, lengths.x, lengths.y, 10);
    fill(255);
    text("Next Level", center.x - 28, center.y + 4);
}

// Give the user $750 of starting balance
var currentBalance;

// Money earned by popping a balloon
var rewardPerBalloon;

// base money earned per wave
var baseRewardPerWave;

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

// method to give user money for completing a wave
function handleWaveReward(waveNum) {
    increaseBalance(baseRewardPerWave * waveNum);
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

var def, eight, slow;

var towerCount;

var difX, difY, count, towerClicked;

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
    spikeLocations = [];
    spikeData = [];
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
    // v == w case
    if (l2 == 0.0)
        return dist(end.x, end.y, point.x, point.y);
    var t = max(0, min(1, p5.Vector.sub(point, start).dot(p5.Vector.sub(end, start)) / l2));
    // Projection falls on the segment
    var projection = p5.Vector.add(start, p5.Vector.mult(p5.Vector.sub(end, start), t));
    return dist(point.x, point.y, projection.x, projection.y);
}

function pointDistToArc(start, center, end, arcData, point) {
    if (Math.abs(arcData.y) < radians(360)) {
        var towerAngles = new Array(2);
        towerAngles[0] = atan2(point.y - center.y, point.x - center.x) - arcData.x;
        if (towerAngles[0] < 0) {
            towerAngles[1] = towerAngles[0] + radians(360);
        } else if (towerAngles[0] > 0) {
            towerAngles[1] = towerAngles[0] - radians(360);
        } else {
            towerAngles[1] = 0;
        }
        for (var _ in towerAngles) {
            var t = towerAngles[_] / arcData.y;
            if (t >= 0 && t <= 1) {
                return Math.abs(dist(point.x, point.y, center.x, center.y) - arcData.z);
            }
        }
    }
    return min(dist(point.x, point.y, start.x, start.y), dist(point.x, point.y, end.x, end.y));
}

function shortestDist(point) {
    var answer = Number.MAX_VALUE;
    var distance = Number.MAX_VALUE;
    for (var i = 0; i < pathSegments.length; i++) {
        var pathSegment = pathSegments[i];
        if (pathSegment.length == 2) {
            var startPoint = pathSegment[start];
            var endPoint = pathSegment[end];
            distance = pointDistToLine(startPoint, endPoint, point);
        } else {
            var centerPoint = pathSegment[centerArc];
            var arcData = pathSegment[arcValues];
            if (dist(point.x, point.y, centerPoint.x, centerPoint.y) < arcData.z + 30) {
                var startPoint = pathSegment[startArc];
                var endPoint = pathSegment[endArc];
                distance = pointDistToArc(startPoint, centerPoint, endPoint, arcData, point);
            }
        }
        answer = min(answer, distance);
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

// Checks if the location of the spike is on the path
function legalSpikeDrop() {
    var heldLocation = spikeLocation;
    return shortestDist(heldLocation) <= PATH_RADIUS;
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

// ------- CODE FOR THE PATH
var pathSegments;

var start, end;

var startArc, centerArc, endArc, arcValues;

var PATH_RADIUS;

var pathLength;

/*
Encompasses: The Path for Balloons, Balloon Movement
 */
function initPoints() {
    addLine(0, 100, 300, 100);
    addSmoothArc(50, PI);
    addSmoothLine(70);
    addSmoothArc(-50, -PI);
    addSmoothLine(100);
    addSmoothArc(-50, -PI / 2);
    addSmoothArc(75, PI / 3);
    addSmoothArc(125, PI / 2);
    addSmoothLine(40);
    addSmoothArc(100, PI / 2);
}

function addLine(startX, startY, endX, endY) {
    pathSegments.push([]);
    // If the line should continue from the existing path
    if (startX === -1 && startY === -1) {
        var pathSegment = pathSegments[pathSegments.length - 2];
        // If the previous path segment was a line
        if (pathSegment.length === 2) {
            startX = pathSegment[end].x;
            startY = pathSegment[end].y;
        } else // If the previous path segment was an arc
        {
            startX = pathSegment[endArc].x;
            startY = pathSegment[endArc].y;
        }
    }
    pathSegments[pathSegments.length - 1].push(new p5.Vector(startX, startY));
    pathSegments[pathSegments.length - 1].push(new p5.Vector(endX, endY));
}

function addArc(x, y, centerX, centerY, displacementAngle) {
    pathSegments.push([]);
    // If the line should continue from the existing path
    if (x == -1 && y == -1) {
        var pathSegment = pathSegments[pathSegments.length - 2];
        // If the previous path segment was a line
        if (pathSegment.length == 2) {
            x = pathSegment[end].x;
            y = pathSegment[end].y;
        } else // If the previous path segment was an arc
        {
            x = pathSegment[endArc].x;
            y = pathSegment[endArc].y;
        }
    }
    // Starting angle
    var startingAngle = atan2(y - centerY, x - centerX);
    // radius of the arc
    var radius = dist(x, y, centerX, centerY);
    // Angle that will determine where the end coordinates are for the arc
    var finalAngle = startingAngle + displacementAngle;
    pathSegments[pathSegments.length - 1].push(new p5.Vector(x, y));
    pathSegments[pathSegments.length - 1].push(new p5.Vector(centerX, centerY));
    pathSegments[pathSegments.length - 1].push(new p5.Vector(centerX + radius * Math.cos(finalAngle), centerY + radius * Math.sin(finalAngle)));
    pathSegments[pathSegments.length - 1].push(new p5.Vector(startingAngle, displacementAngle, radius));
}

function addSmoothArc(distanceAway, displacementAngle) {
    var endPoint;
    var directionVector;
    var pathSegment = pathSegments[pathSegments.length - 1];
    if (pathSegment.length == 2) {
        var startPoint = pathSegment[start];
        endPoint = pathSegment[end];
        var scaleFactor = dist(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        directionVector = new p5.Vector(-(endPoint.y - startPoint.y) * distanceAway / scaleFactor, (endPoint.x - startPoint.x) * distanceAway / scaleFactor);
    } else {
        var centerPoint = pathSegment[centerArc];
        endPoint = pathSegment[endArc];
        var scaleFactor = dist(centerPoint.x, centerPoint.y, endPoint.x, endPoint.y) * pathSegment[arcValues].y / Math.abs(pathSegment[arcValues].y);
        directionVector = new p5.Vector((centerPoint.x - endPoint.x) * distanceAway / scaleFactor, (centerPoint.y - endPoint.y) * distanceAway / scaleFactor);
    }
    addArc(-1, -1, endPoint.x + directionVector.x, endPoint.y + directionVector.y, displacementAngle);
}

function addSmoothLine(steps) {
    var pathSegment = pathSegments[pathSegments.length - 1];
    var centerPoint = pathSegment[centerArc];
    var endPoint = pathSegment[endArc];
    var scaleFactor = dist(centerPoint.x, centerPoint.y, endPoint.x, endPoint.y) * pathSegment[arcValues].y / Math.abs(pathSegment[arcValues].y);
    var directionVector = new p5.Vector(-(endPoint.y - centerPoint.y) / scaleFactor, (endPoint.x - centerPoint.x) / scaleFactor);
    directionVector = p5.Vector.mult(directionVector, steps);
    addLine(-1, -1, endPoint.x + directionVector.x, endPoint.y + directionVector.y);
}

function initPath() {
    print("iyadfuisadyfgyuasdgf")
    initPoints();
    for (var i = 0; i < pathSegments.length; i++) {
        var pathSegment = pathSegments[i];
        print(pathSegment)
        var point1 = pathSegment[0];
        var point2 = pathSegment[1];
        if (pathSegment.length === 4) {
            pathLength += Math.abs(pathSegment[arcValues].y * pathSegment[arcValues].z);
        } else {
            pathLength += dist(point1.x, point1.y, point2.x, point2.y);
        }
    }
}

function drawPath() {
    noFill();
    stroke(color(0x4C, 0x67, 0x10));
    strokeWeight(PATH_RADIUS * 2 + 1);
    ellipseMode(CENTER);
    for (var i = 0; i < pathSegments.length; i++) {
        var pathSegment = pathSegments[i];
        var point2 = pathSegment[end];
        if (pathSegment.length == 2) {
            var point1 = pathSegment[start];
            line(point1.x, point1.y, point2.x, point2.y);
        } else {
            var arcData = pathSegment[arcValues];
            var angle1;
            var angle2;
            if (arcData.y <= 0) {
                angle1 = arcData.x + arcData.y;
                angle2 = arcData.x;
            } else {
                angle2 = arcData.x + arcData.y;
                angle1 = arcData.x;
            }
            arc(point2.x, point2.y, arcData.z * 2, arcData.z * 2, angle1, angle2);
        }
    }
    stroke(color(0x7b, 0x9d, 0x32));
    strokeWeight(PATH_RADIUS * 2);
    for (var i = 0; i < pathSegments.length; i++) {
        var pathSegment = pathSegments[i];
        var point2 = pathSegment[end];
        if (pathSegment.length == 2) {
            var point1 = pathSegment[start];
            line(point1.x, point1.y, point2.x, point2.y);
        } else {
            var arcData = pathSegment[arcValues];
            var angle1;
            var angle2;
            if (arcData.y <= 0) {
                angle1 = arcData.x + arcData.y;
                angle2 = arcData.x;
            } else {
                angle2 = arcData.x + arcData.y;
                angle1 = arcData.x;
            }
            arc(point2.x, point2.y, arcData.z * 2, arcData.z * 2, angle1, angle2);
        }
    }
}

var dp;

// GIVEN TO PARTICIPANTS BY DEFAULT
function getLocation(travelDistance) {
    var memoized = dp[travelDistance]
    if (memoized !== undefined) {
        return memoized;
    }
    var originalDist = travelDistance;
    var distance;
    var point1;
    var point2;
    for (var i = 0; i < pathSegments.length; i++) {
        var pathSegment = pathSegments[i];
        point1 = pathSegment[0];
        point2 = pathSegment[1];
        distance = dist(point1.x, point1.y, point2.x, point2.y);
        if (pathSegment.length == 4) {
            distance = Math.abs(pathSegment[arcValues].y * pathSegment[arcValues].z);
        }
        if (distance <= 0.0000001 || travelDistance >= distance) {
            travelDistance -= distance;
        } else {
            // In between two pathSegments
            var x;
            var y;
            if (pathSegment.length == 2) {
                var xDist = point2.x - point1.x;
                var yDist = point2.y - point1.y;
                var travelProgress = travelDistance / distance;
                x = point1.x + xDist * travelProgress;
                y = point1.y + yDist * travelProgress;
            } else {
                var arcData = pathSegment[arcValues];
                // initial angle  //radius
                var angle = arcData.x + ((1 / arcData.z) * travelDistance * arcData.y / Math.abs(arcData.y));
                x = point2.x + arcData.z * Math.cos(angle);
                y = point2.y + arcData.z * Math.sin(angle);
            }
            dp[originalDist] = new p5.Vector(x, y);
            return new p5.Vector(x, y);
        }
    }
    // At end of path
    var lastPathSegment = pathSegments[pathSegments.length - 1];
    if (lastPathSegment.length == 2) {
        dp[originalDist] = lastPathSegment[end];
        return lastPathSegment[end];
    } else {
        dp[originalDist] = lastPathSegment[endArc];
        return lastPathSegment[endArc];
    }
}

// Amount of each powerup remaining
var powerupCount;

var spikes, slowdown, speedboost;

// Amount of balloons the cluster of spikes will pop before disappearing
var spikePierce;

// Amount of time that a slowdown session lasts for in seconds
var slowdownLength;

// Amount of time that a speed boost session lasts for in seconds
var speedBoostLength;

// The factor to multiply all balloon speeds by
var slowdownAmount;

var slowdownRemaining;

var slowdownLocation;

// Factor to multiply all tower cooldowns by
var speedBoostAmount;

var speedBoostRemaining;

var speedBoostLocation;

// Image for path spikes
var spikeIcon;

// Location of spike for drag and drop
var spikeLocation;

var spikeLocations;

var spikeData;

var originalSpikeLocation;

var spikeHeld;

/**
 * All powerups including
 *  - Path spikes
 *  - Slow Time
 *  - Damage/Speed boost for towers
 */
/**
 * Reimplementation of Drag and Drop for path spikes *
 */
function withinSpikeBounds() {
    return pointRectCollision(mouseX, mouseY, spikeLocation.x, spikeLocation.y, 45);
}

function spikeTrashDrop() {
    var location = spikeLocation;
    if (location.x >= trashX1 && location.x <= trashX2 && location.y >= trashY1 && location.y <= trashY2)
        return true;
    return false;
}

function handleSpikePickUp() {
    if (withinSpikeBounds() && powerupCount[spikes] > 0) {
        spikeHeld = true;
        var location = spikeLocation;
        // Calculate the offset values (the mouse pointer may not be in the direct centre of the tower)
        difX = parseInt(location.x) - mouseX;
        difY = parseInt(location.y) - mouseY;
    }
}

function handleSpikeDrop() {
    if (spikeTrashDrop()) {
        spikeLocation = originalSpikeLocation;
        print("Spike object in trash.");
    } else if (legalSpikeDrop()) {
        // Decrease remaining spikes by 1
        powerupCount[spikes]--;
        spikeLocations.push(spikeLocation.copy());
        spikeData.push(spikePierce);
        spikeLocation = originalSpikeLocation;
        print("Spike Dropped on Path");
    }
    spikeHeld = false;
}

function loadSpikeIcon() {
    spikeIcon = loadImage("https://raw.githubusercontent.com/mcpt/game-dev/main/PartThree/data/spikes.png");
}

function drawSpikeIcon(location, colour) {
    ellipseMode(RADIUS);
    fill(colour);
    ellipse(location.x, location.y, 20, 20);
    imageMode(CENTER);
    image(spikeIcon, location.x, location.y);
}

function drawSpikeIcon(location) {
    imageMode(CENTER);
    image(spikeIcon, location.x, location.y);
}

function drawAllSpikes() {
    for (var i = 0; i < spikeLocations.length; i++) {
        if (spikeData[i] <= 0) {
            spikeData.splice(i, 1);
            spikeLocations.splice(i, 1);
            i--;
        } else {
            drawSpikeIcon(spikeLocations[i]);
        }
    }
}

function drawCurrentSpikeIcon() {
    if (legalSpikeDrop() || spikeLocation == originalSpikeLocation) {
        drawSpikeIcon(spikeLocation, color(0xFF, 0xFF, 0xFF));
    } else {
        drawSpikeIcon(spikeLocation, color(0xF0, 0x00, 0x00));
    }
}

function balloonSpikeCollision(position) {
    for (var i = 0; i < spikeLocations.length; i++) {
        var spikeLocation = spikeLocations[i];
        if (dist(position.x, position.y, spikeLocation.x, spikeLocation.y) <= PATH_RADIUS) {
            spikeData[i] = spikeData[i] - 1;
            // // Spike has popped the balloon!
            return true;
        }
    }
    return false;
}

function displayPowerups() {
    fill(255);
    text("Slowdowns remaining: " + powerupCount[slowdown], 655, 184);
    text("Speed Boosts remaining: " + powerupCount[speedboost], 635, 234);
    var displayColour;
    /**
     * Slowdown
     */
    if (mouseIsPressed && withinSlowdownBounds() && powerupCount[slowdown] <= 0 && slowdownRemaining <= 0) {
        // Display using red error colour
        displayColour = color(0xF0, 0x00, 0x00);
    } else if (slowdownRemaining > 0) {
        // Display blue colour for slowdown in progress
        displayColour = color(0x81, 0xE5, 0xFF);
    } else {
        // Display using white colour
        displayColour = color(0xFF, 0xFF, 0xFF);
    }
    fill(displayColour);
    ellipseMode(RADIUS);
    ellipse(slowdownLocation.x, slowdownLocation.y, 20, 20);
    /**
     * Speed Boosts
     */
    if (mouseIsPressed && withinSpeedBoostBounds() && powerupCount[speedboost] <= 0 && speedBoostRemaining <= 0) {
        // Display using red error colour
        displayColour = color(0xF0, 0x00, 0x00);
    } else if (speedBoostRemaining > 0) {
        // Display blue colour for slowdown in progress
        displayColour = color(0x81, 0xE5, 0xFF);
    } else {
        // Display using white colour
        displayColour = color(0xFF, 0xFF, 0xFF);
    }
    fill(displayColour);
    ellipse(speedBoostLocation.x, speedBoostLocation.y, 20, 20);
    /**
     * Spikes
     */
    if (mouseIsPressed && withinSpikeBounds() && powerupCount[spikes] <= 0) {
        // Display using red error colour
        displayColour = color(0xF0, 0x00, 0x00);
    } else {
        // Display using white colour
        displayColour = color(0xFF, 0xFF, 0xFF);
    }
    fill(displayColour);
    text("Spikes remaining: " + powerupCount[spikes], 625, 146);
    drawSpikeIcon(originalSpikeLocation, displayColour);
}

function withinSlowdownBounds() {
    return pointRectCollision(mouseX, mouseY, slowdownLocation.x, slowdownLocation.y, 45);
}

function handleSlowdownPress() {
    if (withinSlowdownBounds() && powerupCount[slowdown] > 0 && slowdownAmount == 1) {
        powerupCount[slowdown]--;
        slowdownAmount = 0.5;
        slowdownRemaining = slowdownLength * 60;
    }
}

function handleSlowdown() {
    if (slowdownRemaining > 0) {
        slowdownRemaining--;
        if (slowdownRemaining == 0) {
            // Revert to original speed
            slowdownAmount = 1;
        }
    }
}

/**
 * Speed Boost Powerup
 */
function withinSpeedBoostBounds() {
    return pointRectCollision(mouseX, mouseY, speedBoostLocation.x, speedBoostLocation.y, 45);
}

function handleSpeedBoostPress() {
    if (withinSpeedBoostBounds() && powerupCount[speedboost] > 0 && speedBoostAmount == 1) {
        powerupCount[speedboost]--;
        speedBoostAmount = 0.4;
        speedBoostRemaining = speedBoostLength * 60;
    }
}

function handleSpeedBoost() {
    if (speedBoostRemaining > 0) {
        speedBoostRemaining--;
        if (speedBoostRemaining == 0) {
            // Revert to original speed
            speedBoostAmount = 1;
        }
    }
}

// Stores the location of each projectile and how fast it should move each frame
var center, velocity;

// Stores additional projectile data (unrelated to motion)
var projectileData;

// Stores a list of balloons that each projectile has hit, so it doesn't hit the same balloon twice
var balloonsHit;

// Constants to make accessing the projectileData array more convenient
var damage, pierce, angle, currDistTravelled, maxDistTravelled, thickness, dmgType;

var projectileRadius;

// changed values to help upgrades
var defdmg, eightdmg, slowdmg;

var shots;

var slowPercent;

// -------------- TEMPLATE CODE BEGINS ---------------- (Participants will NOT need to code anything below this line)
// For Participants: The HashSet data structure is like an ArrayList, but can tell you whether it contains a value or not very quickly
// The downside of HashSets is that there is no order or indexes, so you can't use it like a normal list
// Think of it like throwing items into an unorganized bin
// Adds a new projectile
function createProjectile(centre, vel, damage, pierce, maxDistTravelled, thickness, dmgType) {
    // Adds an empty set to the balloonsHit structure - this represents the current projectile, not having hit any balloons yet.
    balloonsHit.push([]);
    // Adds the starting location of the projectile as the current location
    center.push(centre);
    // Adds the velocity of the projectile to the list
    velocity.push(vel);
    var angle = atan2(vel.y, vel.x);
    projectileData.push( [ damage, pierce, angle, 0, maxDistTravelled, thickness, dmgType ]);
}

// Checks the distance from a point to a projectile using the pointDistToLine() method coded earlier
function distToProjectile(projectileID, point) {
    var data = projectileData[projectileID];
    var width = Math.cos(data[angle]), height = Math.sin(data[angle]);
    var displacement = new p5.Vector(width, height).mult(projectileRadius);
    var start = p5.Vector.add(center[projectileID], displacement), end = p5.Vector.sub(center[projectileID], displacement);
    return pointDistToLine(start, end, point);
}

// Checks if a projectile is ready to be removed (is it off screen? has it already reached its maximum pierce? has it exceeded the maximum distance it needs to travel?)
function dead(projectileID) {
    var data = projectileData[projectileID];
    return offScreen(projectileID) || data[pierce] == 0 || data[currDistTravelled] > data[maxDistTravelled];
}

// Checks if a projectile is off-screen
function offScreen(projectileID) {
    return center[projectileID].x < 0 || center[projectileID].x > 800 || center[projectileID].y < 0 || center[projectileID].y > 500;
}

// Displays a projectile and handles movement & collision via their respective methods
function drawProjectile(projectileID) {
    var data = projectileData[projectileID];
    stroke(255);
    strokeWeight(data[thickness]);
    var width = Math.cos(data[angle]), height = Math.sin(data[angle]);
    var displacement = new p5.Vector(width, height).mult(projectileRadius);
    var start = p5.Vector.add(center[projectileID], displacement), end = p5.Vector.sub(center[projectileID], displacement);
    line(start.x, start.y, end.x, end.y);
    handleProjectileMovement(projectileID);
    handleCollision(projectileID);
}

// Updates projectile locations
function handleProjectileMovement(projectileID) {
    // Adds the velocity to the current position
    var nextLocation = p5.Vector.add(center[projectileID], velocity[projectileID]);
    // Updates the current position
    center[projectileID] = nextLocation;
    var data = projectileData[projectileID];
    // Tracks the current distance travelled, so that if it exceeds the maximum projectile range, it disappears
    data[currDistTravelled] += velocity[projectileID].mag();
}

// Checks collision with balloons
function handleCollision(projectileID) {
    var data = projectileData[projectileID];
    for (var b in balloons) {
        var balloon = balloons[b];
        // If the balloon hasn't entered yet, don't count it
        if (balloon[delay] > 0)
            continue;
        var position = getLocation(balloon[distanceTravelled]);
        if (distToProjectile(projectileID, position) <= balloonRadius / 2 + data[thickness] / 2) {
            // Already hit the balloon / already used up its max pierce
            if (data[pierce] === 0 || balloonsHit[projectileID].includes(parseInt(balloon[ID])))
                continue;
            // Lowers the pierce by 1 after hitting the balloon
            data[pierce]--;
            // Adds the projectile to the set of already hit balloons
            balloonsHit[projectileID].push(parseInt(balloon[ID]));
            hitBalloon(projectileID, balloon);
        }
    }
}

// -------------- TEMPLATE CODE ENDS ---------------- (Participants will NOT need to code anything above this line)
// Code that is called when a projectile hits a balloon
function hitBalloon(projectileID, balloonData) {
    var data = projectileData[projectileID];
    // Deals damage
    balloonData[hp] -= data[damage];
    if (data[dmgType] == slow && balloonData[slowed] == 0) {
        // Slows down the balloon
        var slowNum = slowPercent;
        if (data[upgrade] >= 2) {
            slowNum -= 0.2;
        }
        balloonData[speed] *= slowNum;
        balloonData[slowed] = 1;
    }
}

// Tracks the tower that is closest to the end, within the vision of the tower
function track(towerLocation, vision) {
    var maxDist = 0;
    var location = undefined;
    for (var b in levels[levelNum]) {
        var balloon = levels[levelNum][b];
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

// Handles all projectile creation
function handleProjectiles() {
    if (playingLevel) {
        for (var i = 0; i < towers.length; i++) {
            var location = towers[i];
            var data = towerData[i];
            data[cooldownRemaining]--;
            var balloon = track(location, data[towerVision]);
            // Cooldown is 0 and there is a balloon that the tower tracks shoots a projectile
            if (data[cooldownRemaining] <= 0 && balloon !== undefined) {
                // Resets the cooldown
                data[cooldownRemaining] = parseInt((data[maxCooldown] * speedBoostAmount));
                var toMouse = new p5.Vector(balloon.x - location.x, balloon.y - location.y);
                if (data[projectileType] == def) {
                    var speed = 24, damage = defdmg, pierce = 1, thickness = 2, maxTravelDist = 500;
                    if (data[upgrade] >= 3) {
                        damage = defdmg + data[upgrade] - 2;
                    }
                    var unitVector = p5.Vector.div(toMouse, toMouse.mag());
                    var velocity_ = p5.Vector.mult(unitVector, speed);
                    createProjectile(location, velocity_, damage, pierce, maxTravelDist, thickness, def);
                    // Default type
                } else if (data[projectileType] == eight) {
                    // Spread in 8
                    var curShots = shots;
                    if (data[upgrade] >= 3) {
                        curShots = shots + 8;
                    }
                    for (var j = 0; j < curShots; j++) {
                        var speed = 18, damage = eightdmg, pierce = 2, thickness = 2, maxTravelDist = 150;
                        var angle = (PI * 2) * j / curShots;
                        var unitVector = p5.Vector.div(toMouse, toMouse.mag());
                        if (data[upgrade] >= 4) {
                            damage = eightdmg + data[upgrade] - 3;
                        }
                        var velocity_ = p5.Vector.mult(unitVector, speed).rotate(angle);
                        createProjectile(location, velocity_, damage, pierce, maxTravelDist, thickness, eight);
                    }
                } else if (data[projectileType] == slow) {
                    // glue gunner - slows balloons
                    // slow-ish speed, low damage, high pierce, low range
                    var speed = 15, damage = slowdmg, pierce = 7, thickness = 4, maxTravelDist = 220;
                    var unitVector = p5.Vector.div(toMouse, toMouse.mag());
                    var velocity_ = p5.Vector.mult(unitVector, speed);
                    createProjectile(location, velocity_, damage, pierce, maxTravelDist, thickness, slow);
                }
            }
        }
    }
    // Displays projectiles and removes those which need to be removed
    for (var projectileID = 0; projectileID < projectileData.length; projectileID++) {
        drawProjectile(projectileID);
        if (dead(projectileID)) {
            projectileData.splice(projectileID, 1);
            center.splice(projectileID, 1);
            velocity.splice(projectileID, 1);
            balloonsHit.splice(projectileID, 1);
            projectileID--;
        }
    }
}

var removeLocation;

function drawRemove() {
    strokeWeight(1);
    stroke(color(0xde, 0xac, 0x9e));
    fill(color(0xFF, 0x69, 0x61));
    rectMode(CENTER);
    rect(removeLocation.x, removeLocation.y, 70, 24, 5);
    textSize(16);
    fill(color(0xff, 0xff, 0xff));
    text("Remove", removeLocation.x - 30, removeLocation.y + 4);
}

function removeCheck() {
    if ((removeLocation.x - 35 <= mouseX && mouseX <= removeLocation.x + 35 && removeLocation.y - 12 <= mouseY && mouseY <= removeLocation.y + 12) && mouseIsPressed && towerClicked != -1) {
        var temp = towerData[towerClicked];
        currentBalance += temp[upgrade] * towerPrice[temp[projectileType]] / 2;
        var temp1 = towerClicked;
        towerClicked = -1;
        towerData.splice(temp1, 1);
        towers.splice(temp1, 1);
    }
}

var cooldownRemaining, maxCooldown, towerVision, projectileType, upgrade;

var towerData;

var towerVisions;

/*
Encompasses: Displaying Towers & Tower Data (for projectiles)
*/
function makeTowerData(towerID) {
    if (towerID == def) {
        return  [ // Cooldown between next projectile
            10, // Max cooldown
                10, // Tower Vision
                towerVisions[def], // Projectile ID
                0, 1 ];
    } else if (towerID == eight) {
        return  [ // Cooldown between next projectile
            25, // Max cooldown
                25, // Tower Vision
                towerVisions[eight], // Projectile ID
                1, 1 ];
    } else if (towerID == slow) {
        return  [ 35, 35, // Tower Vision
            towerVisions[slow], 2, 1 ];
    }
    // filler since we need to return something
    return  [];
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
        var track_ = undefined;
        if (playingLevel) {
            track_ = track(towers[i], data[towerVision]);
        }
        if (track_ === undefined) {
            drawTowerIcon(xPos, yPos, towerColours[towerType]);
        } else {
            drawTowerWithRotation(xPos, yPos, towerColours[towerType], new p5.Vector(track_.x, track_.y));
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
        textSize(12);
        strokeWeight(0);
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

// To upgrade towers, click them and their radius will show around them. Click the upgrade button to upgrade the tpower to the next level
var upgradeLocation;

function towerClickCheck() {
    if (mouseIsPressed) {
        towerClicked = -1;
    }
    for (var i = 0; i < towers.length; i++) {
        var xPos = towers[i].x, yPos = towers[i].y;
        if (pointRectCollision(mouseX, mouseY, xPos, yPos, towerSize) && mouseIsPressed) {
            // Drawing the tower range visually
            towerClicked = i;
        }
    }
}

function drawRange() {
    if (towerClicked != -1) {
        var xPos = towers[towerClicked].x, yPos = towers[towerClicked].y;
        var data = towerData[towerClicked];
        fill(127, 80);
        stroke(127);
        strokeWeight(4);
        ellipseMode(RADIUS);
        ellipse(xPos, yPos, data[towerVision], data[towerVision]);
    }
}

// method to get damage numbers from the type of tower's projectile
function dmgFromProjectileType(type, temp) {
    if (type == 0) {
        var ret = defdmg;
        if (temp[upgrade] >= 3) {
            ret += temp[upgrade] - 2;
        }
        return ret;
    } else if (type == 1) {
        var ret = eightdmg;
        if (temp[upgrade] >= 4) {
            ret += temp[upgrade] - 3;
        }
        return ret;
    } else if (type == 2) {
        return slowdmg;
    }
    return 0;
}

// draw the tower UI - includes the remove option
function drawTowerUI() {
    if (towerClicked != -1) {
        // draw outer box for upgrades
        var temp = towerData[towerClicked];
        stroke(color(0xad, 0xd5, 0x58));
        strokeWeight(1);
        fill(color(0xE7, 0xEA, 0xB5));
        rect(200, 450, 216, 80, 3);
        fill(color(0x44, 0x49, 0x41));
        strokeWeight(0);
        text("Current Level: " + temp[upgrade], 98, 426);
        text("range: " + temp[towerVision], 104, 446);
        text("damage: " + (dmgFromProjectileType(temp[projectileType], temp)), 204, 446);
        strokeWeight(2);
        stroke(color(0xa8, 0xa8, 0x9d, 200));
        line(100, 453, 295, 453);
        drawUpgrade();
        upgradeCheck();
        drawRemove();
        removeCheck();
    }
}

// EDIT THIS FOR UI FOR UPGRADES
function drawUpgrade() {
    strokeWeight(0);
    stroke(0);
    fill(color(0xC3, 0x64, 0xFF));
    rectMode(CENTER);
    rect(upgradeLocation.x, upgradeLocation.y, 86, 24, 5);
    textSize(16);
    fill(255);
    var temp = towerData[towerClicked];
    strokeWeight(0);
    text("Buy: $" + towerPrice[temp[projectileType]] / 2, upgradeLocation.x - 40, upgradeLocation.y + 4);
}

function upgradeCheck() {
    if ((upgradeLocation.x - 43 <= mouseX && mouseX <= upgradeLocation.x + 43 && upgradeLocation.y - 12 <= mouseY && mouseY <= upgradeLocation.y + 12) && mouseIsPressed && towerClicked != -1) {
        var temp = towerData[towerClicked];
        if (currentBalance >= towerPrice[temp[projectileType]] / 2) {
            temp[upgrade]++;
            currentBalance -= towerPrice[temp[projectileType]] / 2;
            if (temp[projectileType] == 0) {
                if (temp[upgrade] == 2) {
                    // first upgrade
                    // increases attack speed
                    temp[maxCooldown] = 8;
                }
            } else if (temp[projectileType] == 1) {
                if (temp[upgrade] == 2) {
                    // second upgrade
                    temp[towerVision] += 50;
                }
            } else if (temp[projectileType] == 2) {
                if (temp[upgrade] > 2) {
                    temp[towerVision] += 50;
                }
            }
            towerData[towerClicked] = temp;
            print("tower number: " + (towerClicked + 1) + ", upgrade level: " + temp[upgrade]);
        }
    }
}

function initializeFields() {
    levels = [];
    balloons = null;
    distanceTravelled = 0;
    delay = 1;
    speed = 2;
    maxHP = 3;
    hp = 4;
    slowed = 5;
    ID = 6;
    balloonRadius = 25;
    levelNum = -1;
    playingLevel = false;
    health = 11;
    currentBalance = 100000;
    rewardPerBalloon = 15;
    baseRewardPerWave = 10;
    currentlyDragging = -1;
    notDragging = -1;
    def = 0;
    eight = 1;
    slow = 2;
    towerCount = 3;
    difX = 0;
    difY = 0;
    count = 0;
    towerClicked = -1;
    held = [ false, false, false ];
    towerPrice = [ 100, 200, 200 ];
    towerColours = [ color(0x7b, 0x9d, 0x32), color(0xF0, 0x98, 0xD7), color(0x82, 0xE5, 0xF7) ];
    originalLocations = [ new p5.Vector(650, 50), new p5.Vector(700, 50), new p5.Vector(750, 50) ];
    dragAndDropLocations = [ new p5.Vector(650, 50), new p5.Vector(700, 50), new p5.Vector(750, 50) ];
    towers = null;
    towerSize = 25;
    towerErrorColour = color(0xE3, 0x07, 0x07);
    trashX1 = 0;
    trashY1 = 0;
    trashX2 = 0;
    trashY2 = 0;
    framesSinceLost = 0;
    pathSegments = []
    start = 0;
    end = 1;
    startArc = 0;
    centerArc = 1;
    endArc = 2;
    arcValues = 3;
    PATH_RADIUS = 20;
    pathLength = 0;
    dp = [];
    powerupCount = [ 5, 3, 3 ];
    spikes = 0;
    slowdown = 1;
    speedboost = 2;
    spikePierce = 3;
    slowdownLength = 7;
    speedBoostLength = 7;
    slowdownAmount = 1;
    slowdownRemaining = 0;
    slowdownLocation = new p5.Vector(763, 208);
    speedBoostAmount = 1;
    speedBoostRemaining = 0;
    speedBoostLocation = new p5.Vector(763, 258);
    spikeLocation = new p5.Vector(763, 150);
    spikeLocations = null;
    spikeData = null;
    originalSpikeLocation = new p5.Vector(763, 150);
    spikeHeld = false;
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
    defdmg = 6;
    eightdmg = 4;
    slowdmg = 1;
    shots = 8;
    slowPercent = 0.7;
    removeLocation = new p5.Vector(255, 470);
    cooldownRemaining = 0;
    maxCooldown = 1;
    towerVision = 2;
    projectileType = 3;
    upgrade = 4;
    towerData = null;
    towerVisions = [ 200, 100, 100 ];
    upgradeLocation = new p5.Vector(145, 470);
}

function preload() {
    loadHeartIcon();
    loadSpikeIcon();
// TODO: put method calls that load from files into this method
// I found the following calls that you should move here:
// - on line 210: heart = loadImage("heart.png")
// - on line 861: spikeIcon = loadImage("spikes.png")
// (note that line numbers are from your Processing code)
}

