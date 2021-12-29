+++
title = "Jumping Physics"
weight = 2
+++

---

{{%attachments style="red" title="Mario" /%}}

Jumping is a very common mechanic in games (especially platformers). In this workshop you'll learn how to implement this mechanic in processing, which can be transferred to other languages. Additionally, you'll learn how to check for collisions in jumps.

### Basics of Jumping in Games

In our platformer-style game, we control the user's jumps by pressing the up button (holding the button for a higher jump) and then the square (character) jumps upwards and then comes back down to the floor. Jumps in most games have a shape resembling a downward facing parabola, the first half where they jump up and their height increases, then gravity pulls them back down the ground.

### Jumping in Our Game

#### 1. verticalMovementState

A variable that tracks the user's current jumping state, either 0,1,2,3 or 4.

- **verticalMovementState = 0 (defaultMovement):** default movement state
- **verticalMovementState = 1 (heightManuallyIncreasing):** user is pressing the up button
- **verticalMovementState = 2 (heightParabolicallyIncreasing):** character is out of fuel, jump trajectory beceomes parabolic
- **verticalMovementState = 3 (heightParabolicallyDecreasing):** character starts to fall (second half of parabola)
- **verticalMovementState = 4 (terminalVelocityReached):** terminal velocity of the user during the fall
  These cases will help us determine which way the character needs to move next.

#### 2. Fuel

We limit the max height a user can jump to with our fuel variable. When the player is manually increasing the height (holding the up button), their character's fuel decreases, and once it hits 0, the character moves to the next movement state. This prevents the user from making their character go upward continuously.

#### 3. Player Array (floats)

```java
final int firstDistFromStart = 100, firstDistFromBottom = 100, firstRun = 25, firstRise = 50;
float[] player = {firstDistFromStart, firstDistFromBottom, firstRun, firstRise};
```

We store the player's attributes in this float array, to store their horizontal distance, vertical distance,

#### 4. Time

We use time to determine the current height of the character by using the parabolic motion formula.

### Programming topics you will need to know (that may be new)

#### 1. keyPressed(), keyPressed and keyReleased()

In Processing, we have the [keyPressed()](https://processing.org/reference/keyPressed_.html) and [keyReleased()](https://processing.org/reference/keyReleased_.html) methods, which run when a key is pressed, and when it is released respectively. The [keyPressed](https://processing.org/reference/keyPressed.html) without brackets is a built in boolean variable that turns true if any key is pressed.

#### 2. Switch case statements

Similar to if-else blocks, switch case statements test if a variable is equal to each case.
The general form looks something like this:

```java
switch(var){
  case case1value:
    //statement
    break;

  case case2value:
    //statement
    break;

  default : //runs if none of the cases are satisfied
    //statements

}
```

For example, if we had the String variable `String day = "Thursday";`:

```java
switch(day){
  case "Monday":
    print("Monday");
    break;

  case "Thursday":
    print("Thursday");
    break;

}
```

The code above will print Thursday, because day's value matches the case "Thursday".

#### 3. PVectors

[PVector Explanation](https://learning.mcpt.ca/game-dev/part-i/pathforballoons/#creating-the-path)

#### 4. ArrayLists

[ArrayList Tutorial](https://learning.mcpt.ca/game-dev/part-i/pathforballoons/#arraylists)

### Main .pde File

In the keyPressed() method, we track what commands the user is putting in, either going left, right or jumping. We use the boolean variables goingLeft and goingRight to 'flag' which way the user is travelling. For going upward, we check if the character is able to jump, and if they are, we can move their movement state to heightManuallyIncreasing.
{{% expand "keyPressed()" "false" %}}

```java
void keyPressed(){
  if (keyCode == LEFT){
    goingLeft = true;
  }
  if (keyCode == RIGHT){
    goingRight = true;
  }
  if (keyCode == UP && canJump){
    verticalMovementState = heightManuallyIncreasing;
  }

}
```

{{% /expand %}}
Similarly, in keyReleased we edit the boolean variables goingLeft and goingRight to indicate that the user has let go of the left or right keys, so the character should stop moving. If the character was in the state heightManuallyIncreasing, that means that the user was holding the up button to make the character jump. If the up key is released, and the character was in this state, we can change the state to heightParabolicallyIncreasing.
{{% expand "keyReleased()" "false" %}}

```java
void keyReleased(){
  if (keyCode == LEFT){
    goingLeft = false;
  }
  if (keyCode == RIGHT){
    goingRight = false;
  }
  if (keyCode == UP && verticalMovementState == heightManuallyIncreasing){
    verticalMovementState = heightParabolicallyIncreasing;
    t = -timeOfMax;
    initialDistFromBottom = player[distFromBottom];
  }
}
```

{{% /expand %}}

### Vertical and Horizontal Movement

#### Horizontal Movement

For moving the character horizontally, we only have to change the character's distance from the start. We do this by creating a constant speed variable, which is the number of units the character will move each time. We use keypresed to check if the user has pressed a key then use the goingLeft and goingRight variables to check if the user has pressed the right arrow key or the left one. If they are moving right then we add to their distFromStart index in the player array. If they clicked the left arrow key, then we subtract from that value.

```java
void determineHorizontalMovement(){
  float horizontalSpeed = 2;

  if (keyPressed){
    if (goingRight){
      player[distFromStart]+=horizontalSpeed;
    }
    if (goingLeft && player[distFromStart] > 0){
      player[distFromStart]-=horizontalSpeed;
    }
  }
}
```

#### Vertical Movement

This part is a bit more complex than horizontal movement, since we need to implement some physics concepts. We write a method `determineHeight()` that implements physics kinematics to find the height of the character at a specific time, and then returns it as a float.
The main vertical movement method uses a switch case (similar to if-else if blocks & explained above) to do specific calculations based on which jumping state the character is in.

```java
case defaultMovement:
    t++;
    player[distFromBottom] = determineHeight(t, timeOfMax, verticalSpeed, initialDistFromBottom,0);
  break;
```

In this first case, we calculate the height of the player by using our determineHeight() method, passing in these paramters. We also add to the total time, since time is passing.

```java
case heightManuallyIncreasing:
    canJump = false;
    if (fuel > 0){
      fuel--;
      player[distFromBottom]+=verticalSpeed;
    }else{
      verticalMovementState = heightParabolicallyIncreasing;
      t = -timeOfMax;
      initialDistFromBottom = player[distFromBottom];
    }
  break;
```

In this case, we prevent the user from making any new jumps. We then check if they have remaining fuel, and add to their height if they are still jumping, as well as decrementing their remaining fuel. Otherwise, if they have no fuel, then they have reached the peak of their manual jump, and we set time equal to the start of the parabolic motion (10s), so that he reaches his peak when t=0. We set the initialDist to the character's current height in order to track his trajectory. Finally, we change their verticalmovement state to parabolically increasing.

```java
case heightParabolicallyIncreasing:
    t++;
    player[distFromBottom] = determineHeight(t, timeOfMax, verticalSpeed, initialDistFromBottom, t0);
    if (t >= 0){
      verticalMovementState = heightParabolicallyDecreasing;
    }
  break;
```

In this case, we calculate the height of the player at time t by using determineHeight(), since it is parabolic motion. Since the max height is at t=0, we check if the time has reached 0. If it has, we change the vertical state from parabolically increasing, to parabolically decreasing.

```java
case heightParabolicallyDecreasing:
    t++;
    player[distFromBottom] = determineHeight(t,timeOfMax, verticalSpeed, initialDistFromBottom, t0);
    if (t >= timeOfTerminalVelocity){
      verticalMovementState = terminalVelocityReached;
    }
  break;
```

In this case, it is similar to the previous method, we add to the time to keep track of it. Additionally, we calculate the player height with determineHeight() again. If the character's time reaches the threshold for terminal velocity, then the user will reach their maximum falling speed, and we change their movement state.

```java
case terminalVelocityReached:
    t++;
    player[distFromBottom] = determineHeight(t,timeOfMax, verticalSpeed, initialDistFromBottom, t0);
  break;
```

In this last case, the user reaches terminal velocity, however we can treat this case very similarly to the previous two cases. We add to time, and calculate the character's height by using the determineHeight() method again.

### Collisions

Additionally, we need to check for collisions between the character and the boxes we've made as part of he map. To do this, we check rectangle-rectangle collision, we need to make sure none of the edges overlap. The methods `determineCollisionType()` and `handleCollision()` determine which side the character is colliding with the block from, and handling how the character moves after the collision respectively.
