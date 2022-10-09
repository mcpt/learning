+++
title = "More Currency"
weight = 2
+++

---

### Currency for Removing Towers

Sometimes, we make mistakes. Maybe you accidentally sour a relationship with a close friend, play the wrong chord in a concert after practicing for months, or you drop your lovingly handcrafted bridge for your ISP in a puddle. While we can’t help you with any of those things in this workshop, we can help you when you change your mind on keeping a tower on the board.

Recall that we used two ArrayLists to store the data for our towers: one to store the position as a PVector and the other to store data of the tower as an integer array. 

```Java
//notice that we could have just included the PVectors in the towerData array as x and y values
//we decided to keep it like this since we are building off our previous workshops
ArrayList<PVector> towers; // Towers that are placed down
ArrayList<int[]> towerData;
```

To remove a tower from the board, we can simply remove the values at that specified index. Since our towers are 1-indexed, we can just take out the (i-1)th tower from our ArrayList storing the position and the ArrayList storing the tower data. When removing, we set a location to be the remove button, known as `removeLocation`. This will remove the tower and give a certain amount of currency when removing it. In our code, we decided that your current balance would go up by the level of upgrade multiplied by the tower’s price divided by two. The following is our method for checking where to remove.

```Java
void removeCheck() {
  if((removeLocation.x - 35 <= mouseX && mouseX <= removeLocation.x + 35 && removeLocation.y - 12 <= mouseY && mouseY <= removeLocation.y + 12) && mousePressed && towerClicked != -1) {
    int[] temp = towerData.get(towerClicked);
    currentBalance += temp[upgrade] * towerPrice[temp[projectileType]] / 2;
    int temp1 = towerClicked; towerClicked = -1;
    towerData.remove(temp1); towers.remove(temp1);
  }
}

```
