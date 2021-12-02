+++
title = "Projectiles"
weight = 6
+++

---

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
