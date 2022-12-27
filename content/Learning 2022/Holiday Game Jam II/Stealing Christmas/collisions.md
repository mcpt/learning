+++
title = "Collisions"
weight = 2
+++

---

For this lesson, we'll be analyzing the code in the file *Platforms*. 

#### Setup

The setup is pretty simple. There's only one global variable:
```java
ArrayList<int[]> platforms = new ArrayList<int[]>();
```
This creates a list of platforms. That's it.

### Simple Collisions

The first method **rectCollision()** checks if two rectangles collide, and returns **true** or **false** depending on what it finds:

```java
boolean rectCollision(int x1, int y1, int w1, int h1, int x2, int y2, int w2, int h2) {  // checks if two rectangles collide
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2;
}
```

It works by comparing the rectangles' coordinates, and seeing if they "overlap".

###### Breakdown:

- x1 < x2 + w2 → if rect 1's x-coord is less than rect 2's x-coord plus its width
    - This means that rect 1 can be anywhere to the left (x1 < x2) or on top (x1 < x2 + w2) of rect 2 while touching it.
- x1 + w1 > x2 → if rect 1's x-coord plus its width is greater than rect 2's x-coord
    - (same as above but reversed)
    - This means that rect 2 can be anywhere to the left (x1 > x2) or on top (x1 + w1 > x2) of rect 1 while touching it.
- y1 < y2 + h2 → if rect 1's y-coord is less than rect 2's y-coord plus its height
    - This means that rect 1 can be anywhere on top (y1 < y2) or to the bottom (y1 < y2 + h2) of rect 2 while touching it.
- h1 + y1 > y2 → if rect 1's y-coord plus its height is greater than rect 2's y-coord
    - (same as above but reversed)
    - This means that rect 2 can be anywhere on top (y1 > y2) or to the bottom (h1 + y1 > y2) of rect 1 while touching it.

### More complex collisions

Now we need to figure out if objects are colliding and on what side they are doing so. The **collide()** method helps us with this.

```java
String collide(int x1, int y1, int w1, int h1, int x2, int y2, int w2, int h2) {  // check if two rectangles collide and which side they collide on
    double dx = (x1 + w1 / 2) - (x2 + w2 / 2);
    double dy = (y1 + h1 / 2) - (y2 + h2 / 2);
    double w = (w1 + w2) / 2;
    double h = (h1 + h2) / 2;
    double crossWidth = w * dy;
    double crossHeight = h * dx;
    String collision = "none";

    if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
        if (crossWidth > crossHeight) 
            collision = crossWidth > -crossHeight ? "bottom" : "left";
        else
            collision = crossWidth > -crossHeight ? "right" : "top";
    }
    return collision;
}
```

##### (partial) Breakdown:
- **dx** → object 1's center x-coord minus object 2's center x-coord (horizontal distance between centers)
- **dy** → object 1's center y-coord minus object 2's center y-coord (vertical distance between centers)
- **w** → the average of both objects' widths (half of one object + half of another object, cut with a vertical line)
- **h** → the average of both objects' heights (half of one object + half of another object, cut with a horizontal line)
- **collision** → stores the type of collision ("bottom", "left", etc.)

- exterior if-statement: if the horizontal distance between the objects is less than or equal to half of one object plus half of the other object (aka if they are touching):
    - determine the type of collision (bottom, left, right, top) depending on how the crossWidth and crossHeight compare to one another

- return statement: return the status of the collision ("none" or the side with which the Grinch collided)

######
And that's about it! The main takeaway is that collisions are recognized when comparing x and y coordinates of different objects relative to one another. We recommend sketching out rectangles colliding and seeing what the criteria is for them to collide!

The rest of the methods in this file are related to your first "next step" task below. :)


### Next Steps

The main focus of this workshop was on movement, physics, and collisions. So, we've taught you the basics... but there's lots more to the game! Now, try to figure out these features! 

- Platform generation and scrolling effect
- Losing
- Implementing sprites and tiles (hint hint! we sort of covered this already...)
- Walking cycles (hint hint! we sort of covered this already as well...)
- Obstacles (hint hint! think: collisions...)
- Present collection and counting (hint hint! think: obstacles...)

Use the code that we've provided for you, as well as the lessons you just covered!

We hope you enjoyed this series of lessons, and have a wonderful day (and break!) :). 