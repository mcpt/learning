+++
title = "Drag And Drop"
weight = 2
+++

---

## Graphic Interface
The drag and drop interface for this game contains a pick up region for the user to pick up towers and a trash box for the user to cancel the pick-up. To pick up a tower, simply click within the light-green pick-up box, drag the tower to a valid position on the field, and release the mouse key. Notice that it will not allow you to place the towers directly on the balloon path. If you decide to change your mind about picking up the tower, just drop it in the trash bin, the dark green rectangle around the pick-up box.

![Interface](/img/Interface-Demo.png)

## Picking Up Towers
To detect when a tower is being picked up, we will use Processing’s built-in `mousePressed()` method, which is called by the system whenever the computer detects that the left mouse button has been pressed down. In order to determine if the user is actually picking up the tower rather than clicking somewhere else on the screen, we will use a method to check if the mouse coordinates are within the pick-up box. It will use "point to rectangle collision" to check if the mouse is within bounds. If both the x distance and the y distance of the mouse from the centre are not greater than half the length of the square, it would be within bounds. See the image and code sample below for reference.

![Collision](/img/Square-Point-Collision.png)

```Java
// Use point to rectangle collision detection to check for mouse being within bounds of pick-up box
boolean pointRectCollision(float x1, float y1, float x2, float y2, float size) {
  //            --X Distance--               --Y Distance--
  return (abs(x2 - x1) <= size / 2) && (abs(y2 - y1) <= size / 2);
}
```

## Dropping Towers
Now, how do we determine when the user has dropped the tower? Processing has a built-in `mouseReleased()` method which is called by the system whenever the user releases the mouse key. If the user was holding a tower when the `mouseReleased()` method is called, then the user has just dropped the tower, and we should handle the drop accordingly.

```Java
// Called by the system whenever the left mouse button is released by the user
void mouseReleased() {
  if (within) { // If the user was holding the tower in the previous frame, the tower has just been dropped
    handleDrop(); // Call the method to handle the drop and check for drop validity
  }

  within = false; // The mouse is no longer holding the tower
}
```

The `handleDrop()` method will check if the tower is either in a valid dropping position on the field, in an invalid dropping position, or in the trash box, which is the dark-green rectangle surrounding the pick-up region that cancels a tower pick-up. In order to see if it is in the trash box, we make sure that the x and y coordinates of the tower is within the set bounds of the trash box. If the tower is in a valid position on the field, we will add this tower to a list of placed-down towers (explained below). Checking validity of tower placements is explained <a href="/game-dev/part-i/towervaliditychecking/">here</a>

## Displaying Towers
In order to keep track of all the towers that have been placed down, we need to use an `ArrayList`. 

{{% notice info "ArrayLists and PVectors"%}}
`ArrayList` is a built-in feature in Processing and Java that is similar to an array. It stores a sequence of values or elements in a list-like fashion. They have the same functionality as an array, with an additional feature of inserting a new element into the ArrayList at any time. Check out <a href="/game-dev/part-i/pathforballoons/">balloon paths</a> for a more detailed explanation or the <a href="https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html">official documentation</a>

`PVector` is a simple data type that stores two numbers and represents an (x, y) coordinate. Official documentation can be found <a href="https://processing.org/reference/PVector.html">here</a>
{{% /notice %}}

We will be using an ArrayList of `PVector` to store the coordinates of every tower that has been placed down. Whenever a tower is dropped in a valid position, we will add that tower’s coordinates to the ArrayList.

```Java
// List of all towers that have been placed down
ArrayList<PVector> towers;

// Adding the location of a new tower to the list of placed-down towers
towers.add(new PVector(x, y));
```

To help with displaying towers, we declared a helper method `drawTowerIcon()` that takes in the basic parameters of the tower that we would like to draw, and draws it onto the canvas.

```Java
// Draw a simple tower at a specified location
void drawTowerIcon(float xPos, float yPos, color colour) {
  strokeWeight(0);
  stroke(0);
  fill(colour);
  rectMode(CENTER);
  rect(xPos, yPos, towerSize, towerSize); // Draw a simple rectangle as the tower
}
```

At each call of the `draw()` function, we will redraw all the placed-down towers whose coordinates are stored in the ArrayList. To do so, we will access each element of our tower ArrayList using a `for` loop and call the `drawTowerIcon()` to draw each tower in its respective position.

```Java
// Redraws all the towers that have been placed down
void drawAllTowers() {
  // Loop through the ArrayList that stores the locations of towers that were placed down
  for (int i = 0; i < towers.size(); i++) {
    float xPos = towers.get(i).x, yPos = towers.get(i).y; // Get the location of the tower from the ArrayList

    // Draw the tower at the specified location
    drawTowerIcon(xPos, yPos, towerColour, new PVector(mouseX, mouseY));

    fill(#4C6710); // Set the fill colour for text
    text("Tower " + (i+1), xPos - 30, yPos - 20); // Write the tower number label
  }
}
```