+++
title = "Making Levels"
weight = 5
+++

---

{{%attachments style="blue" title="Powerups Template Code" /%}}

### Making Levels

Now that we are in the 3rd session, some levels in the game are long overdue. Now that we are more familiar with the concept of arrays and arraylists, let’s see how we can implement them

{{% notice info "Key Concepts" %}}

1. How do we represent a level in code? And how do we store information for it?
2. What happens when a level is being played, and when a level isn't being played?
3. How can we generate levels easily?

{{% /notice %}}

##### Representing a level in code

Before we get to coding anything, we must understand what a level actually is. In bloons tower defense, levels are best defined by the balloon wave that you must pop. For example, in level 1, there are weak balloons that you must pop. In level 2, the balloons are stronger and more numerous. This trend continues as you move to higher and higher levels.

We already have 1 default level that starts immediately when you open the game. What we need to do now is make many distinct levels, and have some control over when each level starts.

##### Making many levels.

As you might have seen from previous lessons, a single balloon is represented by an array of floats, which is a list of values that contain information about the position and state of the balloon. These float arrays were then stored in a larger, master array, which contained all the “balloons” for the default level.

You can thing of it kind of like a folder/file system

![Interface](/img/ArrayVisual1.png)

Now, you could say we need a larger “folder” to store many level folders that contain balloon data. In other words, we need a bigger container that will store each level

![Interface](/img/ArrayVisual2.png)

To do this, we can make some new arrays similar to the default level, and put all of those arrays into a larger array, called levels. We can represent this structure using a 3D array.

```Java
ArrayList<ArrayList<float[]>> levels = new
ArrayList<                   ArrayList<            float[]>>();
/*Main “levels folder”      //A Level folder      //List of balloon
which can store many          which can store       information that
levels                        many balloons         defines a balloon
*/
```

We also need to control what can happen when a level is and isn't being played. For that, we have a boolean isPlaying variable, which disables certain features when false. For example, if a person is not playing yet, the code for _tower tracking_ and _projectile creation_ are essentially turned off, which makes sense since there are no balloons to turn to and shoot new projectiles at. The isPlaying variable is turned to true when the “next level” button pressed, and false when there are no more balloons in the level.

##### Levels API

Now, a way to quickly create balloons for a level would be very nice if you wanted to make a playable game. For that, we have another, very simple API which you can use in the createWaves function in Balloons.pde.

```java
void createWaves(){
//1
createLevels(numberOfLevels);

//2
createBalloons(
    levelTheBalloonsAreFor,
    numberOfBalloons,
    delayOfTheFirstBalloon,
    delayBetweenBalloons,
    speedOfTheBalloons,
    hP
    );
}
```

The first function, **createLevels()**, will help determine how many levels there are in your game. Once you have called/used this function, you can call the **createBalloons()** function to make balloons for a specific level. First, you specify the level you want to assign balloons to (starting from 0, since we are dealing with arrays!). Then you specify the number of balloons and the first balloon’s delay, which essentially controls when this collection of balloons will appear on the screen. Then you can tell the function the delay between the balloons, which controls how spaced apart they are, and also the speed and hp of each balloon.

And there you go! Now you can create your own levels!
