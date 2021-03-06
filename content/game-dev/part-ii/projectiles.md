+++
title = "Projectiles"
weight = 6
+++

---
### Projectile API
For projectiles, we decided to provide an API for you guys. We’ve coded three types of projectiles already, but this part of the workshop will teach you how we made them and how to make more. 

The API contains all the code needed for a projectile to function. Essentially, it creates, stores and updates projectiles and their attributes. 

In short, every projectile has seven values: damage, pierce, angle, current distance travelled, max distance travelled, thickness, and damage type. Damage represents the damage that each projectile does. Pierce is the number of balloons that a projectile can hit before it disappears. Angle is the angle that the projectile is being shot at. The current distance travelled is the distance our current projectile has travelled, whereas the maximum distance travelled hits a range for where the projectile can travel. 

We also used a method called `createProjectile`, which takes in values for the centre, velocity, damage, pierce, maximum distance travelled, thickness and damage type, and it will add it to an ArrayList called `projectileData`. Here is what the code looks like.

{{% expand "See code" "false" %}}
```java
final int damage = 0, pierce = 1, angle = 2, currDistTravelled = 3, maxDistTravelled = 4, thickness = 5, dmgType = 6; // Constants to make accessing the projectileData array more convenient

void createProjectile(PVector centre, PVector vel, float damage, int pierce, float maxDistTravelled, float thickness, int dmgType) {
  balloonsHit.add(new HashSet<Integer>()); // Adds an empty set to the balloonsHit structure - this represents the current projectile, not having hit any balloons yet.
  center.add(centre); // Adds the starting location of the projectile as the current location
  velocity.add(vel); // Adds the velocity of the projectile to the list
  float angle = atan2(vel.y, vel.x);
  projectileData.add(new float[]{damage, pierce, angle, 0, maxDistTravelled, thickness, dmgType});
}
```
{{% /expand %}}

### Handling Projectiles

###### Projectile Cooldown

Cooldown time is a term that is familiar to people who play games. It is applicable to things that do something regularly (eg. shoot, heal, ect.), and it tells us in how much time the thing has to wait to perform its next task. Take the tower that shoots 8 projectiles in our bloons tower defense game. Rather than shooting continuously, it shoots every few moments. In other words, there is a time delay between each shot.

How would you control this delay in code? In our game, each tower has a cooldown time. It starts at 0 when the game starts (meaning the tower can start shooting once a balloon is in range), but after it resets to its designated cooldown time. As moments pass, the cooldown time (or time it has left to wait) decreases until it gets to zero again. Then it can shoot once more.

In the handleProjectiles() function, all towers are handled one at a time using a loop that iterates through the list of towers. The data each tower has associated with it is transferred to the data array, and you can see that right after this data transfer, the index/position in the data array that stores the remaining cooldown time decreases by one. After that is the if-statement that checks if the cooldown time remaining is 0, as well as if a balloon is in range. These are the 2 requirements that are needed to actually shoot a projectile. If these conditions are met, then a projectile will be drawn

###### Projectile Type

Once a tower’s cooldown is 0 and there is a balloon in range, the next thing to determine is which projectile should be drawn. This is determined by the tower’s associated projectile type, stored also in the data array. In the code, this determining is done in the if-else if statements inside the one we just looked at. Let's look at the first one. Essentially what it says is: if the projectile type of this tower is equal to the default projectile type, create all the necessary information needed for a projectile, like its speed, damage, piercing ability, visual thickness, and its maximum travel distance. Then it simply puts all this information into the create projectile function, which then goes on to draw the projectile.

If the tower's projectile type didn’t match with the default type, the program would simply move to the next else-if statement to check if it is the type that is shot 8 at a time. If not, it would move to the next else-if, and so on.

###### Updating Projectiles

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

Inside the if block, we remove the projectile from each of the ArrayLists. These ArrayLists store aspects of the projectiles, such as the centre, velocity, and other data. We must remember to decrement the loop counter `projectileID` when we remove elements from the ArrayLists we are iterating through so that we do not skip any elements.

```java
// Checks if a projectile is ready to be removed (is it off screen? has it already reached its maximum pierce? has it exceeded the maximum distance it needs to travel?)
public boolean dead(int projectileID) {
    float[] data = projectileData.get(projectileID);
    return offScreen(projectileID) || data[pierce] == 0 || data[currDistTravelled] > data[maxDistTravelled];
}
```

This is the dead() method from the template code that identifies projectiles as ‘dead’. The `||` operator is the OR operator, which returns true if at least 1 condition is true. This means that if any of these three conditions are true, the method will return true, resulting in this projectile being removed.


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
