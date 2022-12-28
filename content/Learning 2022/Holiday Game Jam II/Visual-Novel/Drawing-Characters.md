+++
title = "Drawing Characters"
weight = 3
+++
Now that we have some dialogue, why don't we associate those words with a character?

# Storing Character Data

We can tango one of two ways:

1. We make a "character archive", and read from said archive every time we want to draw a character
2. We attach the related character data to each dialogue file

The first one is the better option for the long term but takes lots more work. In a game jam, speed is key! This exactly why we'll be showing you option two.

We can attach a little bit of character data to the beginning of each dialogue file like so:

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

# Accessing Character Data

Since we store the whole object as a `JSONObject` in the code, we can also access the character data pretty easily!

We can make some quick little functions to do this:

```javascript
JSONObject getCharacter(JSONObject obj,String charname) {
    JSONArray array = obj.getJSONArray("characters");
    for (int i = 0; i < array.size();i++) {
        if (array.getJSONObject(i).getString("name").equals(charname)) return array.getJSONObject(i);
    }
    return null;
}
```

This first one will search the `characters` array for something with a key that is the same as the character's name. If it can't find it, it'll return a null, which will result in the program erroring. (which is good!)

```javascript
JSONArray getCharacterList(JSONObject obj) {
    return obj.getJSONArray("characters");
}
```

This one will just get the `JSONArray` of characters, useful for when we want to read some data, like `x`, `y`, `w`, `h`.

From here, we can get the image, which will be stored in the `data` folder.

# Drawing The Character

```java
JSONArray list = getCharacterList(current);
for (int i = 0; i < list.size();i++) {
    JSONObject object = list.getJSONObject(i);
    image(loadImage(object.getString("link")), object.getInt("x"), object.getInt("y"), object.getInt("w"), object.getInt("h"));
}
```

Woah, that's a doozy! Let's break it down piece by piece.

First, we get the character list of the active dialogue file, using the `getCharacterList` method we made. Pretty simple.

We iterate through every character entry since we want to draw every character. We get the `JSONObject` for the character.

We use this `JSONObject` to draw an image. We read the `link` attribute and pass that into `loadImage` to draw it. Do note that `loadImage` should ideally be called once, to prevent lag.

We then read the `x`, `y`, `w`, and `h` values to figure out where to draw it, and how big to draw it.

If we just toss this code into our `draw` function, it'll draw the characters!

**BUT!** We notice some dips in our performance! 😢

# Wuh Woh!

We can track this down to the `loadImage` function, since it has to load the image every frame, for every character. That's what's causing the lag.

Let's do a little trick here:

```java
if (!drawn) {
    background(127,127,127);
    JSONArray list = getCharacterList(current);
    for (int i = 0; i < list.size();i++) {
        JSONObject object = list.getJSONObject(i);
        if (object.getString("name").equals(curSpeaker)) {
            noTint();
            image(loadImage(object.getString("link")),object.getInt("x"),object.getInt("y"),object.getInt("w"),object.getInt("h"));
        }
    }
    drawn = true;
}
```

We limit the number of times it's drawn to once every dialogue piece. When we click, we can set `drawn` to false to ensure that it gets updated, and the lag magically disappears!

The sharp-eyed amongst you will realize something off...
 
What on God's green earth is `noTint`??? And what is this `object.getString("name").equals(curSpeaker)`???

Well, we want to emphasize whichever character is speaking at the moment. This is for those with short attention spans in the crowd (like me), and need a little bit of visual feedback to know which character is talking. To do this, we can colour in the current speaking character, and grey out the other ones. Let me add in the rest of the code:

```java
if (!drawn) {
    background(127,127,127);
    JSONArray list = getCharacterList(current);
    for (int i = 0; i < list.size();i++) {
        JSONObject object = list.getJSONObject(i);
        if (object.getString("name").equals(curSpeaker)) {
            noTint();
            image(loadImage(object.getString("link")), object.getInt("x"), object.getInt("y"), object.getInt("w"), object.getInt("h"));
        }
        else{
            tint(127,127,127);
            image(loadImage(object.getString("link")), object.getInt("x"), object.getInt("y"), object.getInt("w"), object.getInt("h"));
        }
    }
    drawn = true;
}
```

Whoo! It works! We can use this to draw the characters in the scene!

Next on the list, we have *writing dialogue*.