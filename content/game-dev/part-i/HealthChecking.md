+++
title = "Health Checking and Health Bar"
weight = 0
+++

---
### What You'll Learn
###### In this section, you’ll learn how to implement a system that checks if the balloon has reached the end of the path, then remove it from the waves ArrayList.

### The Functions
#### 1. Checking if the Balloon is at the End of the Path
The method has a parameter of the distance travelled by the current balloon, or distanceTravelled. It is a boolean function, meaning that it returns either a **True** or **False** to the user.
```java
// Similar code to distance along path
boolean atEndOfPath(float travelDistance) {
  float totalPathLength = 0;
  for (int i = 0; i < points.size() - 1; i++) {
    PVector currentPoint = points.get(i);
    PVector nextPoint = points.get(i + 1);
    float distance = dist(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
    totalPathLength += distance;  
  }
  if (travelDistance >= totalPathLength){
    return true; // This means the total distance travelled is enough to reach the end
  } 
  return false;
}
```
We keep a float variable to track the total path length, called totalPathLength. Then, we need to assign a value to it, so we loop through the points ArrayList minus the last point (which doesn't contribute to the length of the path), which stores all the points in the path. We calculate the distance between the current and the next point using the distance formula, which is dist() and takes in the (x,y) of point 1 then the (x,y) of point 2. We add this to the total path length distance, and once the loop has finished iterating through the ArrayList, the total path length is assigned to the correct value.

We can check if the balloon has completed its journey if the total distance the balloon has travelled is greater or equal to the total path length. If it has, then we can return true, since the balloon has made it to the end. Otherwise, we return false, since the balloon is still on the path.

#### 2. Drawing the Health Bar
To draw the healthbar, we use two separate functions (line 80 and 84). One to load the image of the heart, and then the other to draw the healthbar.
```java
void loadHeartIcon() {
  heart = loadImage("heart.png");
}
//method to draw a healthbar at the top right of the screen 
void drawHealthBar(){
  //draw healthbar outline
  stroke(0,0,0);
  strokeWeight(0);
  fill(#830000);
  rect(715,455,120,20);
  
  //draw healthbar
  noStroke();
  rectMode(CORNER);
  fill(#FF3131);
  rect(655,445.5,health*10,20); //the healthbar that changes based on hp
  rectMode(CENTER);
  noFill();
  
  //write text
  stroke(0,0,0);
  textSize(14);
  fill(255,255,255);
  text("Health:   "+health,670,462);
  
  //put the heart.png image on screen
  imageMode(CENTER);
  image(heart,650,456);
  noFill();
}
```

