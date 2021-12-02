+++
title = "Projectiles"
weight = 6
+++

---


### Handling Projectiles
{{% expand "See code" "false" %}}
```java
// Displays projectiles and removes those which need to be removed
for (int projectileID = 0; projectileID < projectileData.size(); projectileID++) {
    drawProjectile(projectileID);
    if (dead(projectileID)) {
        projectileData.remove(projectileID);
        center.remove(projectileID);
        velocity.remove(projectileID);
        balloonsHit.remove(projectileID);
        projectileID--;
    }
}   
```
{{% /expand %}}
In the next part of this method, we loop through all the projectiles made, by looping through the ArrayList. We update each projectile with the drawProjectile method (part of template code) which will draw each projectile with all of its attributes such as colour, thickness, etc., then calls two more methods. One that updates the projectile’s movement, and then a final method that checks for collisions with balloons. 

Another part of handling projectiles is removing the projectiles that are ‘dead’. To determine if a projectile is dead, it must either be:
- off the screen
- it cannot pierce anymore balloons
- travelled past the max distance for that type of projectile


```java
// Checks if a projectile is ready to be removed (is it off screen? has it already reached its maximum pierce? has it exceeded the maximum distance it needs to travel?)
public boolean dead(int projectileID) {
    float[] data = projectileData.get(projectileID);
    return offScreen(projectileID) || data[pierce] == 0 || data[currDistTravelled] > data[maxDistTravelled];
}
```

This is the dead() method from the template code that identifies projectiles as ‘dead’. The `||` operator is the OR operator, which returns true if at least 1 condition is true. This means that if any of these three conditions are true, the method will return true. Inside the if block that identifies projectiles as dead, we remove the projectile from each of the ArrayLists. These ArrayLists store aspects of the projectiles. We must remember to decrement the loop counter `projectileID` when we remove elements from the ArrayLists we are iterating through so that we do not skip any elements.


### Balloon Hitting Special Effects
In order to incorporate special effects like the glue gunner slowing down a balloon, we will slightly modify the `hitBalloon()` method. The method will edit features of the balloon (e.g. health, speed) depending on the type of projectile it was hit by. First, retrieve the projectile info from the `projectileData` ArrayList. After decreasing the balloon's hp by the amount of damage that the projectile inflicts, check to see if the projectile is supposed to slow the balloon down (such as a projectile from the glue gunner). Also make sure the balloon has not already been slowed down by another projectile.
 
{{% expand "See code" "false" %}}
```java
if (data[dmgType] == slow && balloonData[slowed] == 0)
```
{{% /expand %}}
 
To slow down the balloon, multiply its speed by a decimal (we chose 0.7) and mark the balloon as "slowed" by setting the `slowed` parameter in `balloonData` to 1. This ensures that the balloon does not get slowed again by a different projectile.

{{% expand "See code" "false" %}}
```java
if (data[dmgType] == slow && balloonData[slowed] == 0) { // Slows down the balloon
  balloonData[speed] *= 0.7;
  balloonData[slowed] = 1;
}
```
{{% /expand %}}

{{% notice info "Challenge: Create Your Own Tower!" %}}
Try implementing your own new tower to earn some bonus points! You will earn 100 points for successfully creating a new tower. The participant who submits the "coolest" tower will earn 300 points. Second place will earn 280 points, third place will earn 260 points, etc.
{{% /notice %}}
