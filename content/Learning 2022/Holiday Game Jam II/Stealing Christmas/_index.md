+++
title = "Platformer Game Workshop"
weight = 2
alwaysopen = false
+++

---

Welcome to our game workshop! We're going to build a Christmas-themed platformer game with jumping physics, collisions, and more! In the game, the Grinch is collecting presents and trying not to run into any obstacles, off of the platforms, or off the screen.

Access our lessons below:

- [1. Basic player movement](/learning-2022/holiday-game-jam-ii/stealing-christmas/movement/)
- [2. Jumping physics](/learning-2022/holiday-game-jam-ii/stealing-christmas/physics/)
- [3. Collisions](/learning-2022/holiday-game-jam-ii/stealing-christmas/collisions/)

Note: these lessons don't go in depth into all of the code you'll find in the zip file below. They're meant for you to understand specific portions of the code and learn how to use them in your own projects (ie. movement and game physics)!

Here are some puzzles for you! Figure out how these concepts work using what we'll teach you, as well as the code we provide below!
- Platform generation and scrolling effect
- Losing
- Implementing sprites and tiles
- Walking cycles
- Obstacles
- Present collection and counting

Download our completed code below!
{{%attachments style="red" title="Stealing Christmas Code" /%}}

### Setup

Start by creating a folder for your project and name it *StealingChristmas*. Inside the folder, create a Processing file with the same name. You'll start writing your program in here. 

You will also need a folder with all of the assets. Download the zip file above, and copy the *data* folder into your own game folder (or use the folder we provided!). 

In your *StealingChristmas* file, create a "constants" comment heading and paste the following code, which initializes the constants in the program:

```java
/* constants */
final int GRAVITY = 3;
final int BACKGROUND_SPEED = 3;
final int BACKGROUND_IMAGE_SPEED = 1;
final int PLATFORM_SPAWN_DIFFERENCE = 150;
```

Then, create a "global variables" comment heading and past the following code, which, well, initializes the global variables:

```java
/* global variables */
boolean[] moveKeys = new boolean[4];  // array to store all directions being pressed: 0 - UP, 1 - DOWN, 2 - LEFT, 3 - RIGHT
int groundY;
boolean lost = false;
int background_imageX = 0;
int score = 0;
```

Finally, create a "graphics" comment heading and paste the following code, which initializes the images (assets) in the game:

```java
/* graphics */
PImage[] tiles = new PImage[6];
PImage[] grinchSprite = new PImage[4];
PImage background;
PImage spike;
PImage present;
PImage snow;
```

Now create a **void setup()** method like the one below:

```java
void setup() {
  size(1000, 600);
  
  // image loading
  for (int i = 0; i < 6; i++) {
    tiles[i] = loadImage("tile" + (i + 1) + ".png");
  }
  for (int i = 0; i < 4; i++) {
    grinchSprite[i] = loadImage("grinch" + (i + 1) + ".png");
  }
  background = loadImage("background.png");
  spike = loadImage("spike.png");
  present = loadImage("present.png");
  snow = loadImage("snow.png");
}
```

This controls the ground tiles and Grinch's walking cycle, as well as loading the images.

Also, from the zip file above, copy the entire *Platforms* file into your folder. We'll annotate the code a bit later, but you'll need this entire program to start. 

Now you're ready to start programming! Head over to the [basic player movement](/learning-2022/holiday-game-jam-ii/stealing-christmas/movement/) page.