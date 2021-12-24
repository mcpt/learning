+++
title = "User Interface"
weight = 4
+++

---

### Drawing Upgrade & Remove Button
In these two methods, we will draw the buttons for upgrading and removing towers. You’ll notice that these two methods are very similar, since they do similar things. 

{{% expand "See code for drawing remove button " "false" %}}
```java
PVector removeLocation = new PVector(255, 470);
void drawRemove() {
  strokeWeight(1);
  stroke(#deac9e);
  fill(#FF6961);
  rectMode(CENTER);
  rect(removeLocation.x, removeLocation.y, 70, 24,5); 
  textSize(16);
  fill(#ffffff);
  text("Remove", removeLocation.x - 30, removeLocation.y+4);
}
```
{{% /expand %}}
 
{{% expand "See code for drawing upgrades button " "false" %}}
```java
PVector upgradeLocation = new PVector(145, 470);
void drawUpgrade() {
  strokeWeight(0);
  stroke(0);
  fill(#C364FF);
  rectMode(CENTER);
  rect(upgradeLocation.x, upgradeLocation.y, 86, 24,5); 
  textSize(16);
  fill(255);
  int[] temp = towerData.get(towerClicked);
  text("Buy: $" + towerPrice[temp[projectileType]] / 2, upgradeLocation.x-40, upgradeLocation.y+4);
}
```
{{% /expand %}}
Both of these methods draw a rectangle with text. We use strokeWeight() and stroke() to change borders around the rectangles, and fill() to fill the rectangle with colour. The PVector upgradeLocation and removeLocation represent the centre of the upgrade and remove buttons respectively. We use a PVector to have a ‘centre’ coordinate to make it easier to check if the user is pressing the button (in upgradeCheck() and removeCheck() above. For the remove button, we just have to write some text to indicate that this button is for removing towers, in this case we just write “Remove” on the button. For upgrades, we also display the price of the current upgrade. This means that we have to get the cost of the upgrade, which is calculated by `towerPrice[temp[projectileType]] / 2`. Finally, we can use text()to write this to the user on the button.
### Creating a tower UI
Now that we have all the methods in place to upgrade and remove towers, we can draw the user interface. This UI will contain the upgrade and remove button, but also tell the user what level the tower is, as well as the damage and range of the tower when it is clicked.

{{% expand "See code for drawing tower UI" "false" %}}
```java
// draw the tower UI - includes the remove option
void drawTowerUI(){
  if(towerClicked != -1) {
    //draw outer box for upgrades
    int[] temp = towerData.get(towerClicked);
    stroke(#add558);
    strokeWeight(1);
    fill(#E7EAB5);
    rect(200,450,216,80,3);
    fill(#444941);
    text("Current Level: " + temp[upgrade],98,426);
    text("range: "+ temp[towerVision],104,446);
    text("damage: "+ (dmgFromProjectileType(temp[projectileType], temp)),204,446);
    strokeWeight(2);
    stroke(#a8a89d,200);
    line(100,453,295,453);
    
    drawUpgrade();
    upgradeCheck();
    drawRemove();
    removeCheck();
  }
}
```
{{% /expand %}}
We start this method by reusing the towerClicked variable, which stores the towerID of the tower the user just clicked. If it is not equal to -1, that means that some tower is being clicked right now, so we can display the tower UI. We will get the tower data of this specific tower from the ArrayList of towers, and then store it in a local temp[] array. This will allow for easier use, since we will need to access the level, range, and damage of the tower. We draw the rectangle which will be the background for the tower UI, then the text indicating the tower’s stats. For the level and range stats, we can take it directly from the temp array since both of those values are stored. To display the damage of the projectile, we call the `dmgFromProjectileType()` method (explained above), then display that value. To end off this method, we draw a line to separate the stats and the buttons, then we can call the drawUpgrade() and drawRemove() methods to draw the upgrade and remove buttons respectively. Finally, the upgradeCheck() and removeCheck() methods are called to make the buttons actually work.
