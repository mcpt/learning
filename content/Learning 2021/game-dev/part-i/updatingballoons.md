+++
title = "Balloon Waves"
weight = 8
+++ 

---
{{%attachments style="red" title="Updating Balloons Template" pattern=".*zip"/%}}

### What You'll Learn

A quick note, all line numbers referenced in this page will refer to the lines in `Balloons.pde`, which you can find at [Game-Dev Github](https://github.com/mcpt/game-dev/blob/main/PartOne/Balloons.pde/ "Open Balloons.pde").
###### In this tutorial, you'll learn how to send balloons in waves, and further understand how the ArrayList storing balloons functions.

{{% notice info "Quick Review!"%}}
As we’ve already learned, ArrayLists are similar to arrays, however they allow for **easier adding/removing of elements** from the list. Additionally, ArrayLists are **resizable**, while arrays must be intialized with a fixed size. 
This allows for more flexibility, and we'll be using ArrayLists to keep track of all the balloons.
To read more, visit [ArrayLists in Path](/learning-2021/game-dev/part-i/pathforballoons/#arraylists)
{{% /notice %}}

### The ArrayList
```java
ArrayList<float[]> balloons = new ArrayList<float[]>();
```
Waves are represented as an ArrayList of float arrays. Each of these float arrays represents a balloon and has three values:
1. At index 0, the value represents the distance travelled, or the number of 'steps' the balloon has taken so far.
2. At index 1, the value represents the delay of the balloon, or the amount of frames before the balloon will appear on the screen.
3. At index 2, the value represents the speed of the balloon, which determines how fast the balloon will move along the path.
These are represented by the global variables (`final int distanceTravelled = 0, delay = 1, speed = 2;`) at line 6.

### The Functions
#### 1. Creating a Wave
The first method `createFirstWave()` starts at line 7, and this method is in charge of adding all the balloons from the first wave into the array. 
```java
void createFirstWave() {
//{Number of "steps" taken, frames of delay before first step, speed}
  balloons.add(new float[]{0, 100, 3});
  balloons.add(new float[]{0, 130, 3});
  balloons.add(new float[]{0, 160, 2});
  balloons.add(new float[]{0, 220, 4});
  balloons.add(new float[]{0, 340, 2});
  balloons.add(new float[]{0, 370, 2});
  balloons.add(new float[]{0, 400, 5});
  balloons.add(new float[]{0, 430, 5});
  balloons.add(new float[]{0, 490, 3});
  balloons.add(new float[]{0, 520, 1});
  balloons.add(new float[]{0, 550, 3});
}
```
To add elements to an ArrayList, we use the `add(element)` method, adds the element (type that ArrayList stores) to the end of the ArrayList. This method adds the float arrays to the ArrayList balloons.

{{% notice tip "Adding to a Specific Index"%}}
If we have an ArrayList storing type String that is called subjects and consists of two elements, "Math" and "Science", we could use `add(0,"ICS")` to add it to the start of the ArrayList (index 0).
{{% /notice %}}

#### 2. Updating Balloon Positions
This method (line 23) updates the position of the balloons every time it runs, as well as draw the balloon at the corresponding position. It has a float array as a parameter, the values of each balloon passed in.
{{% expand "See code" "false" %}}
  ```java
  // Displays and moves balloons
  void updatePositions(float[] balloon) {
    // Only when balloonProps[1] is 0 (the delay) will the balloons start moving.
    if (balloon[delay] == 0) {
      final int RADIUS = 25; //Radius of the balloon
      
      PVector position = getLocation(balloon[distanceTravelled]);
      balloon[distanceTravelled] += balloon[speed]; //Increases the balloon's total steps by the speed
      
      //Drawing of ballon
      ellipseMode(CENTER);
      strokeWeight(0);
      stroke(0);
      fill(#f3cd64);
      ellipse(position.x, position.y,RADIUS,RADIUS);
    } else {
      balloon[delay]--;
    }
  }
  ```
{{% /expand %}}

The first thing to do is check if the balloon has delay or not, which is the first index (second element) of the ArrayList. If the delay is equal to 0, then it means that the balloon is ready to appear on the screen, so we set a final variable as the radius of the balloon. We use the `getLocation()` method to assign the PVector position to the location of the current balloon. A PVector is able to describe a position of an object, storing the x and y components. Then we update the first element of the array according to its speed, by using the += operator, which is the same as `balloon[distanceTravelled] = balloon[distanceTravelled] + balloon[speed];`. 

Next, we can draw the balloon. For this workshop the balloons are just a circle for simplicity, so we just use an ellipse to draw the balloon. The first line, `ellipseMode(CENTER);` specifies what the parameters of ellipse() represent. For the CENTER mode, the first two parameters are the centre, then the width and finally the height. The stroke (border) and fill (background) of the balloon are set to black (0) and yellow (#f3cd64). Then, we draw the ellipse at the correct position, with the RADIUS variable that we initialized earlier.

Finally, if the delay of the current balloon is not 0, then we must subtract 1 from the delay, which is what is done by the else{} block at the end of this method. You can see that this value will never be less than zero, since when it hits zero it will go into the if{} block.

{{% notice info %}}
The documentation for the drawing methods are linked below:
- [ellipseMode](https://processing.org/reference/ellipseMode_.html)
- [strokeWeight](https://processing.org/reference/strokeWeight_.html)
- [stroke](https://processing.org/reference/stroke_.html)
- [fill](https://processing.org/reference/fill_.html)
- [ellipse](https://processing.org/reference/ellipse_.html)
{{% /notice %}}

#### 3. Drawing Balloons on the Screen
In drawBalloons() (line 42), we loop through the entire wave, and call updatePositions() to create the balloons on the screen. This method also checks if the balloon is at the end of the path, by calling the next method, atEndOfPath().

{{% expand "See code" "false" %}}
  ```java
  void drawBalloons() {
    for(int i = 0; i < balloons.size(); i++) {
      float[] balloon = balloons.get(i);
      updatePositions(balloon);
      
      if (atEndOfPath(balloon[distanceTravelled])) {
        balloons.remove(i); // Removing the balloon from the list
        health--; // Lost a life.
        i--; // Must decrease this counter variable, since the "next" balloon would be skipped 
        /* When you remove a balloon from the list,
          all the indexes of the balloons "higher-up" in the list will decrement by 1 */
      }
    }
  }
  ```
{{% /expand %}}

We start by creating a basic for loop, to iterate through every balloon in the wave. For the current balloon in the wave we assign it to the local float array called balloon, by using the get() method of ArrayLists. Using get(index) returns the element at this index. Then, we can call the updatePositions() method that we went over previously, to update and draw the balloons. 

The next step is to check if the balloon has reached the end of the path yet. To do this, we call on the boolean method atEndOfPath() (which will be covered next) to check if the balloon has made it to the end. If it has, we can use the remove(index) method, which removes the element at the specified index of the ArrayList. We can subtract 1 from the user’s health, since the user has allowed a balloon to pass through. Additionally, we must **subtract** one from the loop counter, in order to not skip the next balloon. We can see that all the elements after the one we removed will have their indices shifted down one, and thus the next balloon would now have the same index of the balloon that was just removed. This means that the loop would skip over a balloon if we did not subtract one from the counter.


The method to check if balloons are at the end of the path will be explained in the next section, about the heath checking system. 