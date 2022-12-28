+++
title = "Dialogue Options"
weight = 5
+++
Alright, so we have our characters talking on the screen, but what's a visual novel without some decisions?

# Reviewing Code

Let's have a look back at our dialogue files:

```javascript
{
  "characters": [
    {
      "name": "Me",
      "link": "dog.jpg",
      "x": 100,
      "y": 100,
      "w": 250,
      "h": 250
    },
    {
      "name": "You",
      "link": "cat.png",
      "x": 600,
      "y": 100,
      "w": 250,
      "h": 250
    }
  ],
  "data": [
    {
      "speaker": "Me",
      "dialogue": "Hi!"
    },
    {
      "speaker": "You",
      "dialogue": "Hi!"
    },
    {
      "speaker": "Me",
      "dialogue": "Hello!"
    }
  ],
  "successors": ["dialogue2.json"],
  "options": ["option1"]
}
```

At the bottom, we store the options and the upcoming dialogue. Let's edit this to have some more options, and base our code off this.

```javascript
{
  "characters": [
    {
      "name": "Me",
      "link": "dog.jpg",
      "x": 100,
      "y": 100,
      "w": 250,
      "h": 250
    },
    {
      "name": "You",
      "link": "cat.png",
      "x": 600,
      "y": 100,
      "w": 250,
      "h": 250
    }
  ],
  "data": [
    {
      "speaker": "Me",
      "dialogue": "Hi!"
    },
    {
      "speaker": "You",
      "dialogue": "Hi!"
    },
    {
      "speaker": "Me",
      "dialogue": "Hello!"
    }
  ],
  "successors": ["dialogue2.json","dialogue3.json"],
  "options": ["option1","option2"]
}
```

Alright, now let's look back at our functions to read successors and options.

```java
JSONArray getSuccessors(JSONObject obj) {
    return obj.getJSONArray("successors");
}
JSONArray getOptions(JSONObject obj) {
    return obj.getJSONArray("options");
}
```

# Different Situations

From here, when the dialogue ends, we want to get the list of options, display them, and when the user clicks on an option, we want to change the current dialogue file to whatever is specified.

We also want to check the length of the successor and options arrays. If the successor array is empty, we want to do nothing for now. Then if the options array is empty, but the successor array has one element, we know that there are no options for this dialogue.

If the options array is not the same size as the successor array, then we've made a mistake in our dialogue.

Let's do this real quick:

```java
JSONArray succ = getSuccessors(current);
JSONArray opt = getOptions(current);
if (succ.size() == 0) return;
//if there is 1 successor and no options, go to next
if (opt.size() == 0 && succ.size() == 1) {
    current = loadJSONObject(succ.getString(0));
    nextDialogue();
    return;
}
//ifthere are more options than successors or more successors than options
if (opt.size() != succ.size()) throw new IllegalArgumentException();
drawn = false;
```

# Drawing Options

Now, we have to draw the options. Let's use a boolean to store whether or not we're in a choice, and store the current options and current successors, so we only have to access them once. (to prevent lag!)

```java
JSONArray succ = getSuccessors(current);
JSONArray opt = getOptions(current);
if (succ.size() == 0) return;
//ifthere is 1 successor and no options, go to next
if (opt.size() == 0 && succ.size() == 1) {
    current = loadJSONObject(succ.getString(0));
    nextDialogue();
    return;
}
//ifthere are more options than successors or more successors than options
if (opt.size() != succ.size()) throw new IllegalArgumentException();
currentoptions = opt;
currentsuccessors = succ;
choice = true;
drawn = false;
```

Now, you remember how you never want to hard-code? Throw that out the window. We don't want to use math to figure out where to draw the choice boxes, so we can just assume that we'll only have a maximum of 4 choices, and code the choice boxes for 2 options, 3 options, and 4 options.

Let's create a function to draw these boxes, and change their color when hovered over.

```java
void drawOption(int x, int y, int w, int h) {
    fill(255,255,255);
    if (checkMouse(x,y,w,h)) fill(200,200,200);
    rect(x,y,w,h);
}
```

You may notice the `checkMouse` function in there, it just does some simple checks to make sure the mouse is within the bounds of the box:

```java
boolean checkMouse(int x, int y, int w, int h) {
    if (mouseX >= x && mouseX <= (x + w) && mouseY >= y && mouseY <= (y + h)) return true;
    return false;
}
```

Now, let's do some hard-coding!

```java
if (currentoptions.size() == 2) {
    drawOption(100,175,700,100);
    drawOption(100,300,700,100);
    fill(0,0,0);
    textSize(25);
    text(currentoptions.getString(0),105,175,680,100);
    text(currentoptions.getString(1),105,300,680,100);
}
if (currentoptions.size() == 3) {
    fill(255,255,255);
    drawOption(100,125,700,100);
    drawOption(100,250,700,100);
    drawOption(100,375,700,100);
    fill(0,0,0);
    textSize(25);
    text(currentoptions.getString(0),105,125,680,100);
    text(currentoptions.getString(1),105,250,680,100);
    text(currentoptions.getString(2),105,375,680,100);
}
if (currentoptions.size() == 4) {
    fill(255,255,255);
    drawOption(100,50,700,100);
    drawOption(100,175,700,100);
    drawOption(100,300,700,100);
    drawOption(100,425,700,100);
    fill(0,0,0);
    textSize(25);
    text(currentoptions.getString(0),105,50,680,100);
    text(currentoptions.getString(1),105,175,680,100);
    text(currentoptions.getString(2),105,300,680,100);
    text(currentoptions.getString(3),105,425,680,100);
}
if (currentoptions.size() > 4) {
    print("currently not supported!");
    throw new IllegalArgumentException();
}
```

Yep, that's a lot of hard coding, but it's just copy-and-paste, so our brains aren't being fried. (for now!)

At the end of that, if you have more than 4 options, we just state that it's not supported, and throw out an error.

# Pressing Buttons

Now, we add some code to handle button presses:

```java
if (currentoptions.size() == 2) {
    if (checkMouse(100,175,700,100)) {
        current = loadJSONObject(currentsuccessors.getString(0));
        nextDialogue();
        choice = false;
    }
    if (checkMouse(100,300,700,100)) {
        current = loadJSONObject(currentsuccessors.getString(1));
        nextDialogue();
        choice = false;
    }
}
if (currentoptions.size() == 3) {
    if (checkMouse(100,125,700,100)) {
        current = loadJSONObject(currentsuccessors.getString(0));
        nextDialogue();
        choice = false;
    }
    if (checkMouse(100,250,700,100)) {
        current = loadJSONObject(currentsuccessors.getString(1));
        nextDialogue();
        choice = false;
    }
    if (checkMouse(100,375,700,100)) {
        current = loadJSONObject(currentsuccessors.getString(2));
        nextDialogue();
        choice = false;
    }
}
if (currentoptions.size() == 4) {
    if (checkMouse(100,50,700,100)) {
        current = loadJSONObject(currentsuccessors.getString(0));
        nextDialogue();
        choice = false;
    }
    if (checkMouse(100,175,700,100)) {
        current = loadJSONObject(currentsuccessors.getString(1));
        nextDialogue();
        choice = false;
    }
    if (checkMouse(100,300,700,100)) {
        current = loadJSONObject(currentsuccessors.getString(2));
        nextDialogue();
        choice = false;
    }
    if (checkMouse(100,425,700,100)) {
        current = loadJSONObject(currentsuccessors.getString(3));
        nextDialogue();
        choice = false;
    }
}
```
Again, more copy-and-paste. Now, if we boot this up, it shows our dialogue, and if we click, then it goes to the correct dialogue!

# Conclusion

So, we have some dialogue options! This is one of the last things we need to do, including beautifying our game.

Next up, we have...

Wait a minute, my list is all checked off! It's time to just clean this game up, add some story, and we have a fully-fledged game!