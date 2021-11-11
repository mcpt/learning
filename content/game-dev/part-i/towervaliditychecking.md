+++
title = "Tower Validity Checking"
weight = 10
+++

---
{{%attachments style="red" title="Tower Validity Checking Template" pattern=".*zip"/%}}

## Checking Overlaps

One of the main things we need to make sure of is that our towers aren't being placed in illegal areas. We don't want a million towers on top of each other or towers that are on our balloon's path. When dragging and dropping our towers, we made sure to show visually whether the tower is in a legal area or not. We split up the validity checking into two parts: checking for overlaps with other towers and checking overlaps with the path.

### Checking Overlaps With Other Towers

To check if there is overlap with other towers, we need to store our towers into an **[ArrayList](/game-dev/part-i/pathforballoons/#arraylists)**. We can use a PVector ArrayList to store the (x, y) coordinates of our towers. The formatting would be the exact same as our ArrayList for storing the path, as shown in Example 1. 

###### Example 1
```Java
ArrayList<PVector> towers = new ArrayList<PVector>();
towers.add(new PVector(100, 200));
towers.add(new PVector(150, 175));
towers.add(new PVector(200, 250));
```

Usually, we would need to store a third element in there representing the size, since we need to know how large the tower is to check for validity. Within Game Dev's code, we only use one size for our tower, so we can set a variable representing the size. Since our towers are squares, we only need one variable for side length rather than two for width and length. 

During our drag and drop, we set an `x` and `y` variable, which represents our current tower's x and y coordinates. To check for a singular collision between our current tower and one placed on the ground, we can do a rectangle collision check. 

In essence, a rectangle collision check tests if the distance between the x and y coordinates are both smaller than the size. In our code, we use half the size to allow for more leeway when dropping towers, but you can use the full size if that suits you better. Example 2 shows our function for detecting rectangle collision.

###### Example 2
```Java
boolean pointRectCollision(float x1, float y1, float x2, float y2, float size) {
  //            --X Distance--               --Y Distance--
  return (abs(x2 - x1) <= size / 2) && (abs(y2 - y1) <= size / 2);
}
```

We can automate this similarily to the path. By running a for loop from the beginning to the end of the array, we can check collision for each tower with our current point. This is shown in Example 3.

###### Example 3
```Java
boolean collision = false;
for (int i = 0; i < towers.size(); i++) {
    if (pointRectCollision(x, y, towers.get(i).x, towers.get(i).y, towerSize)) {
        collision = true;
    }
}
```

### Checking Overlaps With Path

Checking for collision with the path uses the same concept as with the towers. We want to check if each line segment on our path will collide with our tower. Call to mind how we used a `PATH_RADIUS` variable, representing half of the size of the path. We want to find the shortest distance from the line to our `(x, y)` point, and check if it is greater than `PATH_RADIUS`. 

To do this, we need to learn how to calculate the shortest distance from a line to any point. Our code borrows code from [StackOverflow](https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment), so you can go check out the code there. 

We can combine the path checking and the tower checking into one boolean function that will be a general check for everything. This is outlined in Example 4:

###### Example 4
```Java
// Will return if a drop is legal by looking at the shortance distance between the rectangle center and the path.
boolean legalDrop() {
  // checking if this tower overlaps any of the already placed towers
  for (int i = 0; i < towers.size(); i++) {
    PVector towerLocation = towers.get(i);
    if (pointRectCollision(x, y, towerLocation.x, towerLocation.y, towerSize)) return false;
  }
  return shortestDist(new PVector(x, y)) > PATH_RADIUS;
}
```

Check out `Towers.pde` if you want to look at how we handled path and tower collision.




