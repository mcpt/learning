+++
title = "Basic Player Movement"
weight = 2
+++

---

The first thing we need to do when creating our game is to create a character. In our game, the character will be the Grinch (from "How the Grinch Stole Christmas", or "The Grinch").

### Keyboard Input

We'll be getting input for the character using the WASD keys on a computer. We use the **keyPressed()** method to check for the pressing of the keys, and **keyReleased()** for their release.

```java
// keep track of which buttons are pressed
void keyPressed() {
  if (key == 'w' || key == UP)
    moveKeys[0] = true;
  if (key == 's' || key == DOWN)
    moveKeys[1] = true;
  if (key == 'a' || key == LEFT)
    moveKeys[2] = true;
  if (key == 'd' || key == RIGHT)
    moveKeys[3] = true;
}

void keyReleased() {
  if (key == 'w' || key == UP)
    moveKeys[0] = false;
  if (key == 's' || key == DOWN)
    moveKeys[1] = false;
  if (key == 'a' || key == LEFT)
    moveKeys[2] = false;
  if (key == 'd' || key == RIGHT)
    moveKeys[3] = false;
}
```

At the top of our program, we create the **moveKeys[]** array. 

```java
boolean[] moveKeys = new boolean[4];  // array to store all directions being pressed; indexes: 0 = UP, 1 = DOWN, 2 = LEFT, 3 = RIGHT
```

In our program, we've made the value at index 0 be upward movement, index 1 to be downward movement, index 2 to be left, and index 3 to be right. The values of these indexes are 1 when their corresponding arrows are pressed, and 0 when they're not. 


### Movement

Inside your program file, create a file called titled *Grinch*. In this file, we'll create a method called **moveGrinch()**, which will, you guessed it, move the Grinch. 

But first, we need to create some variables. Create and set the following variables at the top of your program:

```java
int grinchWidth = 30;    // width of the asset
int grinchHeight = 94;   // height of the asset
int grinchX = 300;       // Grinch's x-coord
int grinchY;             // Grinch's y-coord
int grinchVel = 4;       // Grinch's velocity
```

Nowe we can get started on the **moveGrinch()** method. Inside this method, you'll first set up an arraylist of collisions, and a string for the collision types.

```java
void moveGrinch() {
  ArrayList<String> collisions = platformCollide(grinchX, grinchY, grinchWidth, grinchHeight);
  String collisionTypes = getCollisionTypes(collisions);
```

Then, you'll follow this up with the following if-statements:

```java
  if (moveKeys[0] && !collisionTypes.contains("bottom"))  // UP
    grinchJumping = true;
  if (moveKeys[2] && !collisionTypes.contains("right"))  // LEFT
    grinchX -= grinchVel;
  if (moveKeys[3] && !collisionTypes.contains("left"))  // RIGHT
    grinchX += grinchVel;
    
  physicsGrinch(collisions, collisionTypes);  // apply physics and collision
}
```

The first one, 
```java
  if (moveKeys[0] && !collisionTypes.contains("bottom"))  // UP
    grinchJumping = true;
```
tackles the case where the Grinch has been instructed to move up and there is no collision with the bottom of an object.

The second one tackles the case where the Grinch has been instructed to move left and there is no collision with the right side of an object. And the third one deals with moving right with no collision with anything on their left side. 

The final line sends information to the **physicsGrinch()** method, which tackles the physics behind the Grinch's jumps!

And that's our next lesson on [Jumping Physics](/learning-2022/holiday-game-jam-ii/stealing-christmas/physics/)!