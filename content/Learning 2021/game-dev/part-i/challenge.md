+++
title = "Challenge: Movement"
weight = 7
+++
---
## Moving along the path

Now that you've created a custom path using the `ArrayList` structure, how are we going to get our balloons to move along it smoothly?

### Key Concepts
1. **Coordinate** based representation
2. **Distance** based representation
3. Converting between the two (Challenge)

### Coordinate representations for positions

Normally when we have an object in a game that moves around, we will store two numbers - the **x-coordinate** and the **y-coordinate**. 

![Coordinate Representation](/img/coordinate.gif)

**Drawing** an object using coordinates is extremely simple - all we need to do is create a shape using one of our graphics functions (`ellipse()`, `rect()`, etc.) and it will draw a shape right there. Nothing new.

**Moving** an object along our path with this representation, however, is difficult - because our path can contain lots of twists and turns, it is very hard to figure out the next location a balloon should travel to at any given time.

_Is there a way we can simplify movement?_

### Distance representations for positions

What if instead of storing two co-ordinates, we decided to store a single number, representing the **distance travelled** along our path?

![Distance Representation](/img/distance.gif)

**Moving** an object with this representation is now very simple - all we need to do is increase this number by the **speed** of the balloon every frame.

**Drawing** this object now becomes an issue - how are we supposed to figure out where the balloon is on the screen, just from a single number?

### Representation Conversion

In our game, we will make use of the benefits of **both representations** in order to move our balloons along the path. 

Code-wise, we will **store** the **distance travelled** for each balloon and use the **custom method** `PVector getLocation(float travelDistance)` to convert from **distance representation** to the **coordinate representation**.

When we are displaying balloons, we will call this method and use the converted values in order to display our balloon.

{{% notice info "Challenge" %}}
While this method is already implemented in the templates, we encourage you to try and come up with a solution yourself!

Create an **written explanation** on how such a method would work in theory, earning up to **100** extra points for the Game Jam, on top of the **200** participation points.

Submissions for this challenge are now **closed.**
{{% /notice %}}

### Full Solution
{{% expand "Expand Me!" %}}

Our solution can be split into two simpler steps:
1. Looping through the "lines" formed by each consecutive pair of points, and finding which of the lines our balloon is currently on.
2. Finding the **coordinate** of the balloon given its **progress** along the smaller line.

### Line Identification
To find out which one of the lines our balloon is currently on, we can iterate through each of the points that make up our path, "travelling" from one point to the next.

We can store a variable representing total **remaining** distance to find which of the lines our balloon currently lies on. Let us call this variable `remainingDist`.

At the beginning, this distance will be equal to the total travel distance that is inputted via the method parameter.

When we start looping through the `ArrayList`, we will compare the length of the **current line** and the remaining distance left to travel. 

{{% notice tip "Line Indexes" %}}
Recall that at a line is made up of two consecutive `PVectors`. 

To iterate through each line, we use a for loop, such that at every index `i`, the line is composed of `points.get(i)` and `points.get(i + 1)`. To prevent errors, we will loop to the second-last index rather than the last, as `points.get(i + 1)` will otherwise attempt to access an index out of bounds.   

The length of the current line can be found using the built-in `dist(float x1, float y1, float x2, float y2)` function to find the distance between two points using the pythagorean theorem.
{{% /notice %}}

Let's say we have an imaginary balloon that is moving along the path and needs to travel the initial `travelDistance`.

If the remaining distance left to travel is **greater than or equal to** the length of the line we're on, we can **move** to the next **point** in the path. The remaining distance left to travel now decreases by the length of this line.

If the remaining distance left to travel is **smaller** than the length of the line we're on, this must mean that the balloon is **directly** on top of this current line formed by `points.get(i)` and `points.get(i + 1)`. We can now move on to the second step and exit out of our loop.
* If by the **end of the loop**, the remaining distance left to travel is still greater than zero (and thus, we have not broken out of the loop), this means that we have travelled to the end of the path, and can **return** the **last point** inside the path.

### Progress Identification

Now that we know which two points our line is between, we can use math to figure out the exact location of our balloon. 

If our `remainingDist` is not zero at this point, we will still have some distance left to travel along the **line** we are currently on, **starting from the point**, `points.get(i)`.

Let us call this point, `currentPoint` and the next point that forms a line with the current point, `nextPoint`. 

In order to figure out where our balloon is, we can find a percent ratio between `remainingDist` and the length of the current line. This effectively gives us the **progress** travelled along the current line.

By breaking down this line into **horizontal and vertical components**, we can determine the distance you will need to travel left/right and the distance you will need to travel up/down to get from `currentPoint` to `nextPoint`.

Multiplying these components by the aforementioned **progress** will give us the exact values for how far left/right and how far up/down our balloon has **travelled** from `currentPoint`. Adding these new values to the co-ordinates of `currentPoint` will thus yield us with the location of the balloon, ready to return from our function!

{{% notice info "Full Code" %}}

```java
PVector getLocation(float travelDistance)
{
  float remainingDist = travelDistance;
  for (int i = 0; i < points.size() - 1; i++) {
    PVector currentPoint = points.get(i);
    PVector nextPoint = points.get(i + 1);
    float distance = dist(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
    // Finding the length of an individual line using the built-in dist() function (Pythagorean Theorem)
    if (remainingDist < distance) {
      // Step 2 - In between two points
      float travelProgress = remainingDist / distance;
      // travelProgress is the percent ratio of the remaining travel distance and the distance of the line the balloon is on
      // This will always be less than 1, if it was greater, this else code wouldn't run (remainingDist >= distance)
      float xDist = nextPoint.x - currentPoint.x;
      float yDist = nextPoint.y - currentPoint.y;
      // We take the x and y distance between the two points along the line, multiply these distances by the ratio and add them to the FIRST point to get the specific location
      // This works because our ratio represents the travel progress - if it is close to 0, we are close to the first point, if it is close to 1, it is close to the second point 
      float x = currentPoint.x + xDist * travelProgress;
      float y = currentPoint.y + yDist * travelProgress;
      return new PVector(x, y);
    } else {
      remainingDist -= distance;
      // As we loop through lines, we subtract the length of the line from the travel distance. This signifies a "remainding" travel distance from the nextPoint.
      // If the remaining travel distance is SMALLER than the distance of our current line, we know that we are in between two points and we can move onto the second step.
    }
  }
  // At end of path
  return points.get(points.size() - 1);
}
```
{{% /notice %}}
{{% /expand %}}