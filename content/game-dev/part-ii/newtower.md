+++
title = "New Towers"
weight = 5
+++

---

### Support for New Towers
Part I used only one type of tower, and it was hard-coded into our system. Our program had no support for updating or changing the type of tower, since it assumed there was only one type. Usually, we would use **[Object Oriented Programming](https://en.wikipedia.org/wiki/Object-oriented_programming)**, but this topic isn’t taught until ICS3U. Instead, we’ll try to simplify it into something that is less organized but doesn’t require a whole new topic of programming. 

We want to support multiple types of towers in our improved program. To do this, we decided to map every type of tower to an integer. The three types of towers that we decided to create are the **default** tower (the default tower we used before), the **eight-shot** tower (similar to the tack shooter in BTD), and the **slow** tower, which slows targets (similar to the glue gunner). We mapped default to `0`, eight-shot to `1`, and slow to `2`.

```java
final int def = 0, eight = 1, slow = 2;
```
#### Updating Drag and Drop

In Part I, we taught how to implement drag and drop on a singular tower. To change this to support multiple towers, let’s create some new things. First, let’s create a boolean array of size 3, with indices 0, 1 and 2 representing our towers above. When making your own towers, your array is not limited to size 3 and can be any size you want. Essentially, this array will hold the values of which tower is being held right now.

```java
//values of which tower is being held
//for example, if index 1 is true, then we are holding the eight-shot tower
boolean[] held = {false, false, false}; 
```

Let’s also create a variable called `currentlyDragging`. This will hold the index of the boolean array above that is true. In other words, it will hold the value of the tower we are currently draggin (0 for default, 1 for eight-shot, 2 for slow). Alongside this, let’s create two arrays of PVectors, named `originalLocations` and `dragAndDropLocations`. The first one represents the locations where you are supposed to drag the towers from, whereas the second represents where our current tower is right now. Let’s also create `towerPrice` and `towerColours`, which are the prices of the towers and the colours of the towers, respectively.

```java

int currentlyDragging = -1; // -1 = no tower, 0 = within default, 1 = within eight, 2 = within slow
int[] towerPrice = {100, 200, 200};
color[] towerColours = {#7b9d32, #F098D7, #82E5F7};
PVector[] originalLocations = {new PVector(650, 50), new PVector(700, 50), new PVector(750, 50)}; 
PVector[] dragAndDropLocations = {new PVector(650, 50), new PVector(700, 50), new PVector(750, 50)}; 
//notice indices 0, 1 and 2 correspond to the default, eight-shot and slow towers respectively
```

Using these, we can change how our drag and drop functions. Instead of checking just one location, we can check for all the locations in our `originalLocations` array. Then, we can edit the values in `dragAndDropLocations` according to the tower we picked up. For example, if we pick up the freeze tower and bring it to coordinates `(400, 39)`, then our new dragAndDropLocations would be as follows.

```java
/*values for dragAndDropLocations:
  index:      0          1          2        
  value:  (650, 60)  (700, 50)  (400, 39)
*/
dragAndDropLocations = {new PVector(650, 50), new PVector(700, 50), new PVector(400, 39)};
```

Note that we did not have an array for size as all of our towers are the same size. We’ll leave this implementation as an exercise to the reader.

#### New Tower Data

Previously, we had just used a PVector ArrayList holding all the values of the `(x, y)` coordinates of our towers. Now, we also want to create an ArrayList storing the different values of our towers. Notice how we had previously used indices to represent our towers, using indices `0`, `1,` and `2` to represent our default, eight-shot and slow towers, respectively. Let's use the same concept here on our ArrayLists. Since we want to store multiple values, let's make our ArrayList of type integer array. That is, let's create an ArrayList of integer arrays.

In our program, integers in the array represent the cooldown between the next projectile, the maximum cooldown, the range, and the projectile ID. We can then loop through these arrays similarily to what we did before, and apply the changes to the towers currently on our map. Here is how our tower data is made. Remember that you can play around with these values to create different types of towers.

```java
int[] makeTowerData(int towerID) {  
  if (towerID == def) {
    return new int[] {
      10, // Cooldown between next projectile
      10, // Max cooldown
      towerVisions[def], // Tower Vision
      0 // Projectile ID
    };
  } else if (towerID == eight) {
    return new int[] {
      25, // Cooldown between next projectile
      25, // Max cooldown
      towerVisions[eight], // Tower Vision
      1 // Projectile ID
    };
  } else if (towerID == slow) {
    return new int[] {
      35,
      35,
      towerVisions[slow], // Tower Vision
      2
    };
  }
  return new int[] {}; //filler since we need to return something
}
```

### TL;DR
To create new towers, use arrays with each index representing values for that type of tower. All of the original drag and drop methods now ahve a parameter **towerID** passed into them corresponding to which of the three is currently being dragged/dropped. Alternatively, you can use **[Object Oriented Programming](https://en.wikipedia.org/wiki/Object-oriented_programming)**.