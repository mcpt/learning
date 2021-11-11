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

Code-wise, we will **store** the **distance travelled** for each balloon and use the **custom method** `PVector getLocation(float distanceTravelled)` to convert from **distance representation** to the **coordinate representation**.

When we are displaying balloons, we will call this method and use the converted values in order to display our balloon.

{{% notice info "Challenge" %}}
While this method is already provided within the templates, we encourage you to try and come up with a solution yourself!

You will have the opportunity to **submit** an **explanation** to how such a method would work, earning up to **100** extra points for the **Game Jam**, on top of the **200** participation points.

After submissions close, a full solution behind our implemented method will be provided, explaining exactly how everything works!
{{% /notice %}}
