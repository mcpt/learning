+++
title = "Health Checking and Health Bar"
weight = 2
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

For these final two functions, we first call the loadImage() method which loads the image specified in parameters to the PImage, in this case it is called heart. The image must be in a folder called data. 
Since our file is called balloons.pde, the file explorer should look like:
- Balloons.pde
- data
  - heart.png

After we load the image, we can draw the healthbar, with the method drawHealthBar() starting on line 85. In this method, we will draw the updated healthbar, first drawing the rectangle outline for the bar which is done by drawing a rectangle and filling it. Next, we draw the rectangle that reflects how much health the user has, which has 11 sections for the 11 health points the user has. Since the outer rectangle has 132 width, each point of health the user has can be represented as a section of 12 pixels, so we draw a rectangle with width health*12. This second rectangle will shorten as the health variable decreases.

Finally, we can put in the text that tells the user how much health they have left, as well as put in the heart image that we imported earlier. The image() function draws the image at the coordinates provided (second and third parameter). In imageMode(CENTER), these two coordinates represent the centre point of the image.
