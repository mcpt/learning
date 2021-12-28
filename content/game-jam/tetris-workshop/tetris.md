+++
title = "Tetris"
weight = 5
+++
---

Let's now relate everything back to implementing Tetris. There are a few main concepts that a Tetris game needs:

- Game Grid (landed array)
- Representation of our tetrominoes with OOP and multi-dimensional arrays
- Using multiple threads to detect inputs and bring down blocks at the same time

Let's look at each part separately and see how we can apply the knowledge we've learned to create each part.

### Game Grid

In Tetris, we have a two dimensional grid that represents our game grid. The standard is a 10x20 board, using each block as a unit, but we can make the board any size we want. 

![Grid](/img/gridexample.png)

To represent this grid, we can use a 2D array of integers, where the value at each cell represents if there is a block there or not. Here is what it would look like:

![Landed Array](/img/landedarrayexample.png)

Let's call this grid a "landed array". This is because it will only store blocks that have already landed on our screen. We can also use different integers to represent different colors.

![Colored Blocks](/img/coloredlandedarrayexample.png)

Everytime we drop a block, we want the block to be added to this landed array according to its color.

### Tetromino Logic and Implementation

In Tetris, we call each block that is made of four squares "tetrominoes". We can store each tetromino as a 2D array. Here is how it would look like:

```Java
int[][] tetromino = {{0, 1},
                     {0, 1},
                     {1, 1}};
//this represents the j block tetris piece shown below
```

![J Block](/img/jblockexample.png)

To make life easier, we want to store all of the rotations of our block in an array. Recall thata 3D array is an array of 2D arrays. This means that we can use a 3D array to store all the rotations.

```java
int[][][] rotations = 
{
    {
        {0, 1},
        {0, 1},
        {1, 1}
    },
    {
        {1, 0, 0},
        {1, 1, 1},
    },
    {
        {1, 1},
        {1, 0},
        {1, 0}
    },
    {
        {1, 1, 1},
        {0, 0, 1},
    },                        
};
```

We can now use Object Oriented Programming to make our lives a lot easeir. Let's create a Tetromino class with attributes for rotations, current rotation, width and height. The rotations would store all the rotations of our Tetromino. The current rotation represents the rotation we are on from an index of 0-3. The width and height would represent our current rotation's width and height. We can make an array of our Tetromino class, storing the 7 types of tetrominoes.

{{% expand "See Tetromino code" "false" %}}
```java
//note that for simplicity, we create 4 rotations for every block, even though some of the blocks look the same after some rotations
 public void fillTetrominos() {
    //I block
    tets[0] = new Tetromino(new int[][][] {
        {{2, 2, 2, 2}},
          
            {{2},
             {2},
             {2},
             {2}},
       
        {{2, 2, 2, 2}},
       
            {{2},
             {2},
             {2},
             {2}}
    });
    //J block
    tets[1] = new Tetromino(new int[][][] {
        {{1, 1, 1}, 
         {0, 0, 1}},
       
        {{0, 1},
         {0, 1},
         {1, 1}},
        
        {{1, 0, 0}, 
         {1, 1, 1}},
       
        {{1, 1},
         {1, 0},
         {1, 0}}
    });
    //L block
    tets[2] = new Tetromino(new int[][][] {
        {{4, 4, 4}, 
         {4, 0, 0}},
       
        {{4, 4},
         {0, 4},
         {0, 4}},
        
        {{0, 0, 4}, 
         {4, 4, 4}},
       
        {{4, 0},
         {4, 0},
         {4, 4}}
    });
    //O block
    tets[3] = new Tetromino(new int[][][] {
        {{7, 7},
         {7, 7}},
        
        {{7, 7},
         {7, 7}},
        
        {{7, 7},
         {7, 7}},
        
        {{7, 7},
         {7, 7}}
    });
    //S block
    tets[4] = new Tetromino(new int[][][] {
        {{0, 3, 3},
         {3, 3, 0}},
       
        {{3, 0},
         {3, 3},
         {0, 3}},
        
        {{0, 3, 3},
         {3, 3, 0}},
        
        {{3, 0},
         {3, 3},
         {0, 3}}
    });
    //T block
    tets[5] = new Tetromino(new int[][][] {
        {{0, 5, 0},
         {5, 5, 5}},
        
        {{5, 0},
         {5, 5},
         {5, 0}},
        
        {{5, 5, 5},
         {0, 5, 0}},
        
        {{0, 5},
         {5, 5},
         {0, 5}}
    });
    //Z block
    tets[6] = new Tetromino(new int[][][] {
        {{6, 6, 0},
         {0, 6, 6}},
        
        {{0, 6},
         {6, 6},
         {6, 0}},
        
        {{6, 6, 0},
         {0, 6, 6}},

        {{0, 6},
         {6, 6},
         {6, 0}}
    });
}
```
{{% /expand %}}

![rotations](/img/tetrisrotationsexample.png)

Now, we want to store the current block that is falling. We can store a current position with an `blockX` and `blockY`, and store the rest of the info with a Tetromino object. We can then use this object to determine how our block should function in the next segment.

### Multiple Threads for Block Movement

We want to have at least two threads when making Tetris, one for detecting inputs for block movement and rotation and one to bring the block down every tick. If you want to implement a soft or hard drop function or a hold function, you will have to include it in the second thread. 

For our first thread, we will just detect if left, right or up is pressed and will either move the current tetromino left, right or rotate it, respectively. This thread will do nothing else otherwise. When doing this, we will need to do checks if the block can go left, right or rotate. We don't want the block going out of bounds and breaking our game.

Our second thread will bring down our block every tick. A tick can be represented as whatever unit you want it to be, so we can just use half a second. If we want to bring down the block, we can press the down key to bring it down one unit every time. For hard drops, we can project what the block would look like underneath by using using a loop to check when it would hit the ground, and then draw white squares over the projected landing place. When you want to hard drop, just automatically insert the block into its projected location and create a new block using a random function, and reset its `blockX` and `blockY` values. For holding with our second thread, we want to check if the hold key is pressed, usually C. If it is pressed when it is empty, treat it like the block was hard dropped, where a new block is automatically generated. However, instead of a hard drop, we want to put it into a hold variable, of type Tetromino, which we can then swap in when you press C again. After our first initial hold, our hold variable will never be empty, so we want to swap out the block with our hold variable. Remember that we can only swap once every new block, so you will have to add an extra boolean variable that will check whether you have swapped in this turn. 

Sometimes, threading might not work how you want to, so you can always separate the inputs for checking holds and drops into a third thread and leave automatic block movement in its own isolated thread. 

If you would like to see the implementation for these two threads, refer to `KeyPress.java` and `MoveDown.java`.



