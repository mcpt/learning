+++
title = "Advanced Tracking"
weight = 3
+++

---

{{%attachments style="green" title="Part2_AdvancedTracking" pattern=".*zip" /%}}

### What You'll Learn

Last session we implemented a function that rotated a tower to face a balloon based on the slope of the line made with a balloon and tower. Today we will implement a more representative procedure, which will make a tower face a balloon that is within hit radius, and is also the farthest along the path.

##### Key Concepts

1. Using a function that processes inputs to create an output
2. Implementing tower range
3. Implementing a filtering mechanism that will get the right balloon

Remember that in Processing, Y values increase as you move _down the window_. Therefore, the origin (0,0) is at the top-left corner of the window.

### Logic for the Procedure

Every function has an input, a process, and a resulting output. The function we are making today is no different. First, let’s consider inputs. Since this function is trying to find a balloon within a tower’s hit radius, we will need the tower’s coordinates, the tower's hit-radius, and a list (array) of all the balloons to scan. The output is pretty straightforward; just the coordinates of the balloon we want. With this in mind, our function looks something like this.

![Interface](/img/Function.png)

Now we need to come up with the code that will process these inputs and spit out the correct balloon location. Remember, this function must 1. Find the balloons in range, and 2. Find the one in this group that is farthest along the path. In other words, we have to come up with a filtering mechanism that can be applied to each balloon and give the one that satisfies these requirements. Knowing this now, we can start coding our function.

```java
PVector track(PVector towerLocation, int vision, ArrayList<float[]>){
  PVector location = null;
  Cycle through all balloons{
    if (distance between tower coordinates & balloon coordinates <= vision){
      if (the balloon is, so far, the farthest along one we have seen){
        location = balloonLocation;
      }
    }
  }
  return location;
}
```

##### Implementation!

Lets translate this into real processing code with our program’s global variables and methods, as well as a few extra variables to keep track of the furthest distance travelled across the balloons we have seen.

```java
PVector track(PVector towerLocation, int vision, ArrayList<float[]>){
  int maxDist = 0;
  PVector location = null;
  for (float[] balloon: balloons){
    PVector balloonLocation = getLocation(balloon[distanceTravelled]);
    if (dist(balloonLocation.x, balloonLocation.y,towerLocation.x,towerLocation.y) <= vision){
      if (balloon[distanceTravelled] > maxDist){
        location = balloonLocation;
        maxDist = balloon[distanceTravelled];
      }
    }
  }
  return location;
}
```

The first new addition we’ll look at is the 4th line in the function that uses the getLocation() function. All balloons can be represented by an array (or list) of numeric values that describe its properties, and one index (or position in the list) stores the journey length of each balloon. You can think of it as storing the number of steps the balloon has taken on the path. However, we need a way to translate this number of steps to actual coordinates. This is done by simply using the getLocation() function.

We also added the maxDist variable. This is a dynamic/changing value that will update once a new balloon is found to have a greater journey length than previous balloons. When a balloon like this is found, the journey length of it (which is essentially measured in the number of “steps” the balloon has made) is stored in this variable, and “location” has this balloon’s location assigned to it. Because maxDist starts at 0, the first balloon to pass the first filter will have its journey length/steps assigned to the maxDist variable. The 2nd, 3rd, 4th, ect. a balloon must then have a longer journey length to pass through the 2nd “if” to store its location data into the location variable. In other words, the next balloon must "beat" the previous balloon in terms of journey length. If any of them do, their distance travelled will then be assigned to maxDist. The result is a competition-inducing piece of code that will always end up storing the balloon with the longest path, which is exactly what we want.

And there you go! Now that we have determined the balloon that the tower should point at, we can run it through the tower rotation function we created last session. Now, towers will always point to the balloons within their hit radius that are farthest along the path.
