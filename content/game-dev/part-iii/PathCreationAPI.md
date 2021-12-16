+++
title = "Path Creation API"
weight = 5
+++

---

{{%attachments style="blue" title="Powerups Template Code" /%}}

### Path Creation API

Before this, balloons have moved in straight lines. That’s cool and all, but what if we wanted to implement some maps like this?

![Interface](/img/PathAPI/RealPathExamples.png)

Obviously, straight lines are not going to cut it. Instead, we need a way to implement **curves**, and we need to have some tools that will make it easy for us to smoothly connect them. As a result, we developed an API (a set of useful functions) that will help us do this.

```java
//1
addLine(startPointX,startPointY,endPointX,endPointY);

//2
addArc(startPointX,startPointY,centerPointX,centerPointY, angleOfRotation);

//3
addSmoothLine(lineLength);

//4
addSmoothArc(distanceAwayFromPathTip, angleOfRotation);
```

{{% expand "addLine(startPointX, startPointY, endPointX, endPointY);" "false" %}}
This is the most straightforward function. Just define a line with 2 points - a start and end point - and it will draw it for you.

Eg. addLine(0,200,300,200); gives:
![Interface](/img/PathAPI/AddLine.png)
{{% /expand %}}

{{% expand "addArc(startPointX, startPointY, centerPointX, centerPointY, angleOfRotation);" "false" %}}

To draw a circular path segment using this function, you must first define where the segment starts - startPoint. Then, you define the center point of the arc (centerPoint), which is the point from where the arc is curved around. Finally you have an angle of rotation, which determines how much curve is in the arc.

Eg. addArc(0,200,200,100,-radians(90)); gives:
![Interface](/img/PathAPI/AddArc.png)

**Note**: The _radians()_ function simply converts angles from degrees to radians, which is perferred by Processing. Also, the point you see in the center of the arc is just for understanding - it will not appear when you are making your own path.
{{% /expand %}}

{{% expand "addSmoothLine(lineLength);" "false" %}}

This function is used to extend the paths of arcs in a smooth way. The lineLength argument (or input) is used to describe how far the arc should be extended

Eg.

addArc(0,200,200,100,-radians(90));

addSmoothLine(200);

gives:
![Interface](/img/PathAPI/AddSmoothLine.png)
{{% /expand %}}

{{% expand "addSmoothArc(distanceAwayFromPathTip, angleOfRotation);" "false" %}}

This function draws a smooth arc from an already existing line or arc. To understand it, you must imagine an arrow that starts from the path’s end, and points in a direction so that it is a +90 degree rotation from the path.

![Interface](/img/PathAPI/AddSmoothArcBefore.png)

{{% notice info "Processing Angles"%}}
Remember that Processing angles start from east and increase counterclockwise. This should be taken into account when imagining the arrows.
{{%/notice%}}

_distanceAwayFromPathTip_ describes how far away the **center** of the arc should be from the tip of the path, along the line described by the red arrow. If you would like to have the center of the arc be in the opposite direction of the arrow, simply put a negative value.

//addSmoothArc(100,radians(105)); and addSmoothArc(-100,-radians(105)); respectively give:
![Interface](/img/PathAPI/AddSmoothArcAfter.png)

As you can see, the addSmoothCurve() function can be used with other arcs to make more complex curves. You can also put many addSmoothCurve()’s together to make interesting shapes.

{{% /expand %}}
