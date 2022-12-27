+++
title = "Jumping Physics"
weight = 2
+++

---

Now we're going to look into the physics of the Grinch's jump. 

### Variables

At the top of your *Grinch* file, you'll need to add the following variables:

```java
int grinchJumpHeight = 400;
boolean grinchJumping = false;
int grinchJumpingFrame = 0;
int animationCounter = 0;
int frame = 0;
```

### Drawing the Grinch

Create a method called **drawGrinch()** that "draws" the Grinch on the game screen, and moves it through his walking cycles. Here's the entire method:

```java
void drawGrinch() {
  noStroke();

  frame++;
  if (frame % 10 == 0)
    animationCounter++; // move to next walk cycle image every 10 frames (1/6 of a second)
    animationCounter %= 4;  // keep walk frame within range of 4
    frame %= 60;
  
  if (grinchJumping)  // if he's jumping don't draw walk cycle
    animationCounter = 1;
  image(grinchSprite[animationCounter], grinchX - 10, grinchY, 51, 94);
}
```

All it does is it moves from one Grinch image to another every 10 frames, and doesn't cycle if the Grinch is jumping.

### Updating the Grinch's Movement

A game screen requires constant updates. So, we need to create an **updateGrinch()** method:

```java
void updateGrinch() {
  moveGrinch();
  drawGrinch();
  
  if (grinchY >= height || grinchX < 0)  // if the grinch leaves screen, you lose
    lost = true;
}
```

This method moves the Grinch (we'll cover this method below), then draws him, and finally checks if the Grinch is off-screen — in which case he loses.

### The Grinch's Physics

If you take a look at the **physicsGrinch()** method in the *Grinch* file we've provided for you, you'll see that it requires two parameters: **ArrayList<String> collision** and **String collisionTypes**. These parameters are used to access collisions the Grinch gets into (we'll cover collisions in the next lesson).

The first line of the method is an if-statement:

```java
if (grinchJumping)
    grinchY += GRAVITY * (0.1 * (1 + grinchJumpingFrame));  // move grinch down with gravity
```

This moves the Grinch down with gravity if he's jumping. Go to our *StealingChristmas* file and try to play around with the value of the **GRAVITY** variable!

Then, we have an else-statement:

```java
else
    grinchY += GRAVITY * 1.5;  // if hes not jumping, that means he fell off a platform, so make him fall a bit faster
```

The **physicsGrinch()** method is only called when the Grinch is jumping or in freefall; if he's not jumping, he's falling off of a platform. So, since he's getting closer to the ground, he should fall a bit faster, which is what this equation does. 

After this line, we have some more code within the else-statement:

```java
if (collisionTypes.contains("top")) {  // make sure he cant fall through the floor
    for (int i = 0; i < collision.size(); i++) {  // you can collide with multiple platforms; loop through each
      String[] thisCollision = collision.get(i).split(";");
      if (thisCollision[0].equals("top")) {  // if hit the top of platform
        grinchY = int(thisCollision[1]) - grinchHeight;  // set the grinch y value to the top of the platform (can't move into platform)
        
        if (grinchJumping && grinchJumpingFrame >= 1) {  // make sure he gets a chance to actually jump
          resetJump();
        }
      }
    }
  }
```

This code makes sure that the Grinch can't fall through the floor. If the type of collision he has is "top" (if he's colliding with the top of an object), the program loops through all of the possible platforms the Grinch could be colliding with. We do this so that we don't have a situation where the Grinch can't go through one platform but can go through another; all of the platforms are being checked.

If the Grinch hits the top of one of the platforms while falling off of another one, we set the Grinch's vertical position (y-coord) to the height of the platform. This way he can't move through it.

The final if-statement here is used in a situation where the Grinch tries to jump after being on a platform. Without the if-statement he wouldn't be able to do this, because the program would perceive him "colliding" with the platform he is currently on. So, we reset the jump when the frame is at least 1 so that it gives the Grinch enough time to jump off of the platform. 


Once we exit the **if (collisionTypes.contains("top"))** if-statement, we are still within the exterior else-statement. We meet a new if-statement here:

```java
if (collisionTypes.contains("left")) {  // make sure he doesn't move into walls
    for (int i = 0; i < collision.size(); i++) {  // can collide with multiple platforms, so loop through each
      String[] thisCollision = collision.get(i).split(";");
      if (thisCollision[0].equals("left")) {
        grinchX = int(thisCollision[3]) - grinchWidth - BACKGROUND_SPEED - 1; // if they hit the side of a platform, move them next to it (prevents clipping)
      }
    }
  }
```

This if-statement is very similar to the previous one, except it ensures that the Grinch cannot move through platforms horizontally. We once again loop through all the possible platforms he can collide with. If he collides with a platform's left side, his x-coordinate is set to right next to the platform; he can't move through it.


The final if-statement within the exterior else-statement is this one:

```java
if (grinchJumping) {
    grinchJumpingFrame++;
    grinchY -= (grinchJumpHeight / (25 + grinchJumpingFrame));  // if grinch jumping, move him up in a somewhat parabolic way
  }
```

This if-statement modifies the shape of the Grinch's jump motion into a parabolic-looking one. 

And that's about it for the physics of the game! Go check out our next lesson on [Collisions](/learning-2022/holiday-game-jam-ii/stealing-christmas/collisions/)!