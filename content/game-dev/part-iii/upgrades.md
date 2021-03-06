+++
title = "Tower Upgrades"
weight = 2
+++

---

{{%attachments style="orange" title="Upgrades Template" /%}}

### Introduction
Personally, the part I enjoyed most about Bloons Tower Defence is trying out each path for each tower to see what they all do. Now, in Part III, we’ve finally implemented upgrades. We’ll be teaching you how to edit the different values that you may want to use when making your own upgrade paths.

### Framework for Upgrades

Before making upgrades, we need to add a state that stores the value of the tower currently clicked. Think back to BTD and how clicking on a tower will show the upgrades that you can get. For our game, we want to have a similar thing so that we don’t end up upgrading all towers at the same time. 

To do this, let’s add a new variable called `towerClicked`. If we set no tower to -1, then our tower will have a default value of -1 and will also become -1 when we click on anything that is not a tower. To check. Here is the implementation of `towerClicked`:

{{% expand "See code" "false" %}}
```Java
int towerClicked = -1; //no tower clicked
void towerClickCheck() {
  if (mousePressed) {
    towerClicked = -1;
  }
  for (int i = 0; i < towers.size(); i++) {
    float xPos = towers.get(i).x, yPos = towers.get(i).y;
    if(pointRectCollision(mouseX, mouseY, xPos, yPos, towerSize) && mousePressed) {
      // Drawing the tower range visually 
      towerClicked = i; //clicked the ith tower, from indices 0 to towers.size() - 1
    }
  }
}
```
{{% /expand %}}


Now, let’s add an extra set of values to our `towerData` integer arrays that represent our tower’s current upgrade level. Every time we upgrade our current tower, we increment that tower’s upgrade index in its respective integer array in `towerData`. 

{{% expand "See code" "false" %}}
```Java
final int cooldownRemaining = 0, maxCooldown = 1, towerVision = 2, projectileType = 3, upgrade = 4;
//initial values of 1 for upgrade since they are level 1
int[] makeTowerData(int towerID) {  
  if (towerID == def) {
    return new int[] {
      10, // Cooldown between next projectile
      10, // Max cooldown
      towerVisions[def], // Tower Vision
      0, // Projectile ID
      1
    };
  } else if (towerID == eight) {
    return new int[] {
      25, // Cooldown between next projectile
      25, // Max cooldown
      towerVisions[eight], // Tower Vision
      1, // Projectile ID
      1
    };
  } else if (towerID == slow) {
    return new int[] {
      35,
      35,
      towerVisions[slow], // Tower Vision
      2,
      1
    };
  }
  return new int[] {}; //filler since we need to return something
}
```
{{% /expand %}}

To do this, we need to create an `upgradeCheck()` method that checks if you click the upgrade button. To check for upgrades, we just need to check if there is a valid tower under `towerClicked` and if we click on the button that will represent our upgrade. If we do click on it, then we’ll take the value of the towerData at `towerClicked` and edit the values there. We increment the index representing upgrades, which will affect the types of upgrades we do. For this workshop, we decided that upgrades would cost half the amount of the tower cost, but you can play around with this value.

{{% expand "See code" "false" %}}
```Java
if (currentBalance >= towerPrice[temp[projectileType]] / 2) {
  temp[upgrade]++; currentBalance -= towerPrice[temp[projectileType]] / 2 ;
}
```
{{% /expand %}}

### Different Upgrades

For upgrades, our default tower first increases its attack speed and then increases its damage by one every upgrade after that. For our eight shot tower, it first increases its range, then the number of shots from 8 to 16, then increases the damage. For our slow tower, the first upgrade will increase the slow from 70% of the balloon’s original speed to 50%, and then it will increase the range for every update after that. While some of the updates are easily done by editing values in `towerData`, other values require for us to go into `Projectile.pde` and make a few edits.

To increase the attack speed, we just need to reduce the `maxCooldown` of the tower in the towerData. Increasing the range just requires us to increase our value at `towerVision`. Here is the implementation:

{{% expand "See code" "false" %}}
```Java
int[] temp = towerData.get(towerClicked);
temp[maxCooldown] = 8; //increases attack speed
temp[towerVision] += 50; //increases range
```
{{% /expand %}}

Increasing damage, number of shots, and slow reduction is a bit harder. Let’s look at damage first. To make things simpler, we decided to create variables to represent the default damage of our towers without any upgrades.

{{% expand "See code" "false" %}}
```Java
int defdmg = 6, eightdmg = 4, slowdmg = 1;
```
{{% /expand %}}

Notice how every time we want to shoot a projectile, we create a new amount of damage for that projectile that represents how much damage that projectile does. Usually it’s just `damage = defdmg`, but let’s change this up a bit to make it better. Recall that we have a value that represents our upgrade level in `towerData`. For our situation, since it is always adding more damage including and after the 2nd upgrade, we can set a new equation representing what our new value for damage should be:

{{% expand "See code" "false" %}}
```Java
if (data[upgrade] >= 3) { //notice that it’s 3 since we are level 3 at the second upgrade
  damage = defdmg + data[upgrade] - 2; //we subtract 2 because at level 3, we want to add 1 damage
}
```
{{% /expand %}}

The same logic can be applied to our number of shots and slow percent. We can set a default number of shots and slow percent, and edit those values depending on the upgrade level. The implementation is shown below:

{{% expand "See code" "false" %}}
```Java
//eight shot implementation
int shots = 8;
int curShots = shots;
if (data[upgrade] >= 3) {
  curShots = shots + 8;
}
//slowing implementation
float slowPercent = 0.7;
float slowNum = slowPercent;
if (data[upgrade] >= 2) {
  slowNum -= 0.2;
}
```
{{% /expand %}}

Here is our final upgrade check, including checking whether you click the button and upgrading things accordingly:

{{% expand "See code" "false" %}}
```Java
void upgradeCheck() {
  if((upgradeLocation.x - 43 <= mouseX && mouseX <= upgradeLocation.x + 43 && upgradeLocation.y - 12 <= mouseY && mouseY <= upgradeLocation.y + 12) && mousePressed && towerClicked != -1) {
    int[] temp = towerData.get(towerClicked);
    if (currentBalance >= towerPrice[temp[projectileType]] / 2) {
      temp[upgrade]++; currentBalance -= towerPrice[temp[projectileType]] / 2 ;
      if (temp[projectileType] == 0) {
        if (temp[upgrade] == 2) { //first upgrade
          temp[maxCooldown] = 8; //increases attack speed
        }
      } else if (temp[projectileType] == 1) {
        if (temp[upgrade] == 2) { //second upgrade
          temp[towerVision] += 50;
        }
      } else if (temp[projectileType] == 2) {
        if (temp[upgrade] > 2) {
          temp[towerVision] += 50;
        }
      }
      towerData.set(towerClicked, temp);
      println("tower number: " + (towerClicked + 1) + ", upgrade level: " + temp[upgrade]);
    }
  } 
}
```
{{% /expand %}}


### Getting a Tower’s Damage from Projectile Type
{{% expand "See code" "false" %}}
```java
int dmgFromProjectileType(int type, int[] temp){
  if(type==0) {
    int ret = defdmg;
    if (temp[upgrade] >= 3) {
      ret += temp[upgrade] - 2;
    }
    return ret;
  }
  else if(type==1) {
    int ret = eightdmg;
    if (temp[upgrade] >= 4) {
      ret += temp[upgrade] - 3;
    }
    return ret;
  }
  else if(type==2) {
    return slowdmg;
  }
  return 0;
}
{{% /expand %}}
In this return method, we calculate the damage of a tower based on the projectile type and the tower’s current level, then return it. We take in two parameters, `type` which is the projectile’s type, as well as the temp array which is the tower’s data. We have three types of projectiles, so we will create three if/else if blocks. The first block will be `type==0`, which means that it is a “default” projectile. The `ret` variable will store the tower’s damage, and it is initialized as the default projectile’s level 1 damage. We can calculate the updated damage by adding 1 point of damage for every level that the tower is above 3. We can then return the tower’s damage by returning the `ret` variable. 
This is similar for the projectile that shoots in 8 directions, and the one that slows. For `type==1`, we set ret to the default level 1 damage for this projectile `eightdmg`, add damage based on the level, and then return the updated damage value. 
For the last type of projectile that slows balloons, the if block is even simpler since the upgrades do not affect the damage, but instead change the amount it slows by. This means that we can set ret to the original damage value and then return it. Outside this method, we have a `return 0;` statement because the method needs a ‘default’ return statement. This statement won’t be reached in our code, since type can only be 0,1 or 2.
