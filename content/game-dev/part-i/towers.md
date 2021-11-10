+++
title = "Rotating Towers"
weight = 2
+++

---

### What You'll Learn

In this section, we will break down the process of rotating towers so that they always face a balloon.

We will talk about the **drawTowerIcon()** function staring on line 79 of [Towers.pde](https://github.com/mcpt/game-dev/blob/main/PartOne/Towers.pde "Open Towers.pde")

##### Key Steps

1. How do we calculate the _slope of the line_ from the _tower to a balloon_?
2. How do we use that slope to calculate an _angle of rotation_?
3. How do we use that angle of rotation to _rotate the tower_?

Remember that in Processing, Y values increase as you move _down the window_. Therefore, the origin (0,0) is at the top-left corner of the window.

### Slope of a Line Connecting a Tower to a Balloon

![Interface](/img/Line-Slopes.png)

The slope of a line is essentially a measure of incline. This incline is determined by _how the hieght of the line changes as you move along the X-axis_. Take a look at line 1. As you move along the x-axis (go from left to right), the height (or _Y-values_) of the line decreases, and so we say it has a negative incline, or slope value. In line 2, the line's height doesn't change, so we say it has a slope of 0. For line 3, the height/Y-value increases as you move along the X-axis, so we say the slope is positive. As you may see, the _slope of a line contains some information about the direction from one point to another_.

All you need to calculate the slope of a line is 2 points on the line itself.

```java
float slope = (targetLocation.y - yPos) / (targetLocation.x - xPos);
```

The formula for slope is (y2 - y1)/(x2 - x1), where (x1,y1) and (x2,y2) are points on a line. This is the formula the code above uses. (targetLocation.x, targetLocation.y) is the coordinates of the tower, and (xPos,yPos) are the coordinates of a balloon. The code stores the slope in a _float_ variable to be used later.

### Slope -> Angle

Now we need to find a way to use the slope we calculated to determine the angle the tower must rotate to face the balloon. To do this, we will use the trigonometric function inverse tan - _atan()_ - to convert our slope into an angle.

There is, however, one issue with using slope to go to an angle.

![Interface](/img/Rotation-Mechanism.png)

In the image, there are 2 lines going from the tower to 2 different balloons. Despite the arrows pointing opposite ways, the lines the arrows make have the same slope. Lets look back at our deifinition of slope: _change in hieght (or Y-value) as you move along the X-axis_. Both lines approach the X-axis at the same intensity, which means their inclines, or slopes, are the same. In this case, we'll assume that their slopes are -1, which means for every 1 unit increase in _X_, there is 1 unit decrease in height (or in other words, decrease in _Y_).

However, the identical slopes into atan(), you will get only 1 kind of angle, when there should very clearly be 2. If we assume the slope is -1, plugging that into atan() will tell us that the tower should turn -45 degrees for both balloons. This works for balloon 1, which is on the right side of the tower, but balloon 2 on the left needs an angle of rotation exaclty 180 degrees away from balloon 1.

{{% notice info "Recap"%}}

1. Slope is a line's incline, which is defined by the change in the line's height as you move along the X-axis (in this case, height is Y-value)
2. The function atan() can be used to generate an angle from a slope
3. We need to find a way to differentiate balloon points that make similar slopes to find the proper angles

{{%/notice%}}
