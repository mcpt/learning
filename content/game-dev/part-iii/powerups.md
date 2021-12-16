+++
title = "Powerups"
weight = 6
+++

---

{{%attachments style="blue" title="Powerups Template Code" /%}}

### Road Spikes
One feature in tower defense games is road spikes which are intended for use in urgent situations, where balloons are approaching the end of the path and need to be popped quickly. The implementation of road spikes is similar to towers, but the drag-and-drop interface was slightly different, since spikes are placed ***on*** the path rather than off, and they do not shoot anything, but rather sit on the path until a balloon comes by.

The first modification to the drag-and-drop that needs to be made is to ensure that spikes are placed on the path. Recall beforehand that we checked to see if towers were *not* on the path by ensuring that its distance from the path is greater than the path's radius. Similarly, we will check to see if the distance of the spike to the path is ***less than*** the radius.

{{% expand "See code for checking spike drop locations" "false" %}}
```java
// Checks if the location of the spike is on the path
boolean legalSpikeDrop() {
  PVector heldLocation = spikeLocation;
  return shortestDist(heldLocation) <= PATH_RADIUS;
}
```
{{% /expand %}}

Next, we need to head to the `Balloons.pde` file to have every balloon check if they are within the range of a spike. 

{{% expand "See code for checking spike pops" "false" %}}
```java
PVector position = getLocation(balloon[distanceTravelled]); // Get the current location of the balloon
if (balloonSpikeCollision(position)) { // Check for a collision between the balloon and any spike
    handleBalloonPop(); // Award player for popping the balloon
    balloons.remove(i); // Balloon has been popped! Remove it from the list
    i--; // Obligatory index fixing due to ArrayList indexing
    continue;
}

boolean balloonSpikeCollision(PVector position) {
  for (int i = 0; i < spikeLocations.size(); i++) {
    PVector spikeLocation = spikeLocations.get(i);
    if (dist(position.x, position.y, spikeLocation.x, spikeLocation.y) <= PATH_RADIUS) { // See if there is a collision between the spike and the balloon
      spikeData.set(i, spikeData.get(i) - 1);
      return true; // // Spike has popped the balloon!
    }
  }
  return false;
}
```
{{% /expand %}}

### Balloon Slowdowns
The function of the balloon slowdown is to temporarily decrease the moving speeds of all the balloons to half their original speed. To do this, we will keep a `slowdownAmount` variable which will be multiplied into the speed of every balloon at all times.

```java
float travelSpeed = balloon[speed] * slowdownAmount; // Slow down the balloon if the slowdown powerup is engaged
balloon[distanceTravelled] += travelSpeed; // Increases the balloon's total steps by the speed
```

Initially the `slowdownAmount` variable will be set to `1` to effect no change on the balloons' speeds. In the `handleSlowdownPress()` method, we will set `slowdownAmount` to `0.5` in order to multiply the speeds of all balloons by half.

{{% expand "See code for handleSlowdownPress()" "false" %}}
```java
void handleSlowdownPress() {
  if (withinSlowdownBounds() && powerupCount[slowdown] > 0 && slowdownAmount == 1) {
    powerupCount[slowdown]--;
    slowdownAmount = 0.5;
    slowdownRemaining = slowdownLength * 60;
  }
}
```
{{% /expand %}}

To make sure slowdowns are temporary, we will set a `slowdownRemaining` variable to keep track of how many frames of slowdown is left. Since the Processing frame-rate is 60 frames per second, one second will go by in 60 frames. Whenever the slowdown button is pressed, we need to refill `slowdownRemaining` with 60 times the length of a slowdown session in seconds. At each frame that goes by, `slowdownRemaining` will be decreased by 1. Once it reaches 0, the slowdown effect will be cancelled.

{{% expand "See code for handling each frame of slowdown" "false" %}}
```java
void handleSlowdown() {
  if (slowdownRemaining > 0) {
    slowdownRemaining--;
    
    if (slowdownRemaining == 0) { // Once slowdown has ended...
      slowdownAmount = 1; // Revert to original speed
    }
  }
}
```
{{% /expand %}}

### Tower Speed Boosts
This powerup will give every tower a speed boost for a limited amount of time. More specifically, the cooldown time for each tower will be reduced, allowing towers to shoot projectiles more quickly. Similar to the slowdown powerup, we will keep track of a `speedBoostAmount` which will be multiplied into the cooldowns of every tower on the field. We will modify the `Projectiles.pde` file to account for the speedboost value.

```java
data[cooldownRemaining] = (int)(data[maxCooldown] * speedBoostAmount); // Resets the cooldown accounting for the speedBoostAmount factor.
```

Make sure to cast the cooldown value into an integer since the `data` array stores integers rather than floating point numbers. Other than this slight change, all other parts of the powerup's implementation are identical to the slowdown powerup.