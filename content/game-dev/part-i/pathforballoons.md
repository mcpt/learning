+++
title = "Path For Balloons"
weight = 6
+++

---

## Prerequisite - Dynamic Arrays

To create a path for balloons, you will have to learn about a commonly used tool that will aid you greatly in your quest to make the perfect tower defense: ArrayLists.

#### ArrayLists

While useful, arrays have a fatal flaw: they require for the user to set a static size, making adding an arbitrary number of elements challenging. Here's where ArrayLists come into play.

**ArrayLists** are an object taken from the Java language, based around the concept of dynamic arrays. **Dynamic arrays** are an extension of arrays. Where arrays required a set capacity at declaration, ArrayLists allow for you to add and remove elements dynamically. This means that the ArrayList will automatically resize itself to accomodate for the changes made. 

Formally, **dynamic arrays** are a random access, variable-size list data structure that allows for elements to be dynamically added and removed. ArrayLists are the most commonly used type of dynamic arrays. 

To use ArrayLists, you will first have to import the ArrayList library. There are multiple ways to declare an array. Example 1 will outline the different declaration methods.

###### Example 1
```Java
import java.util.ArrayList; //importing the library


//notice E represents the type of element contained in the ArrayList, e.g. int, bool, string, PVector

ArrayList<E> var_name = new ArrayList<E>(); //standard declaration with datatype E

ArrayList<E> var_name = new ArrayList<E>(initial_size): //declaration with size
```

For more information on ArrayLists in Processing, refer to this **[link](https://processing.org/reference/ArrayList.html)**.

***

## Creating The Path

Now that we know how to use ArrayLists, we can use it to help build our path. 

We can add points, or **[PVectors](https://processing.org/reference/PVector.html)**, to our ArrayList. PVectors are essentially an `(x, y)` point as a variable. Here is how we access our PVector's `x` and `y` values:

```Java
PVector point = new PVector(20, 10);
point.x; //retrieves x value
point.y; // retrieves y value
```

We can store these points into an ArrayList to represent our path. We can link up every element and the element after it together to make a line. We would link indices 0 and 1, 1 and 2, 2 and 3, and so on. Every time we link up two points, we can create a new line, which will connect to our previous line. These connections of lines will create a path for our balloons.

###### Example 2
```Java
ArrayList<PVector> path = new ArrayList<PVector>(); //declaration
//adding points
path.add(new PVector(30, 40));
path.add(new PVector(50, 50));
path.add(new PVector(70, 80));
path.add(new PVector(90, 100));
```

Let's use Example 2 as our reference. Looking at indices 0 and 1, we get the two PVectors (30, 40) and (50, 50). Let's call the line connecting these points A. Next, let's connect indices 1 and 2. Connecting (50, 50) and (70, 80) will create a new line that stems from line A. Let's call this new line B. Finally, we can add indices 2 and 3, which will gives us a line from (70, 80) to (90, 100), which will stem from line B. Let's call this line C. 

Linking together lines A, B, and C will give us the path for our balloons. We can use the processing line function to create our lines, as shown in Example 3.

###### Example 3
```Java
//putting points into variables
PVector point0 = path.get(0);
PVector point1 = path.get(1);
PVector point2 = path.get(2);
PVector point3 = path.get(3);

line(point0.x, point0.y, point1.x, point1.y);//creates a line from (30, 40) to (50, 50)
line(point1.x, point1.y, point2.x, point2.y);//creates a line from (50, 50) to (70, 80)
line(point1.x, point2.y, point3.x, point3.y);//creates a line from (70, 80) to (90, 100)
```

To make our lines look more like a path, we can use a massive **[strokeWeight](https://processing.org/reference/strokeWeight_.html)** to our lines. This will make our path's width very large, making it look less like a group of sticks and more like a real path. We stored a variable called `PATH_RADIUS`, which represents the value we will be increasing our stroke by.

###### Example 3 with strokeWeight
```Java
//changes the thickness of the lines to make it look more like a path
strokeWeight(PATH_RADIUS * 2 + 1); //notice we multiply by two here, since strokeWeight measures the width or diameter he one at the end represents the middle line, surrounded by the two PATH_RADIUS blocks.

PVector point0 = path.get(0);
PVector point1 = path.get(1);
PVector point2 = path.get(2);
PVector point3 = path.get(3);

line(point0.x, point0.y, point1.x, point1.y);
line(point1.x, point1.y, point2.x, point2.y);
line(point1.x, point2.y, point3.x, point3.y);
```

To automate this logic, we can run a for loop as shown in Example 4. Notice that we go up until `path.size() - 2` instead of `path.size() - 1`, since we will go out of bounds by accessing index `path.size()`.

###### Example 4
```Java
strokeWeight(PATH_RADIUS * 2 + 1); 

//links up indices 0 and 1, 1 and 2, 2 and 3 and so on
for (int i = 0; i < path.size() - 1; i++) {
    PVector point0 = path.get(i);
    PVector point1 = path.get(i + 1);
    line(point0.x, point0.y, point1.x, point1.y);
}
```

Check out `Path.pde` if you want to see how our path was made!

***

{{% notice info "TL;DR" %}}
ArrayLists can automatically resize themselves when you add or remove elements, while arrays have a set size. We can use an ArrayList to store the points of our path and use a for loop to create line segments connecting the points with a large strokeWeight.
{{% /notice %}}


