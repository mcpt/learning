+++
title = "Reading JSON"
weight = 2
+++
---
As a programmer, you never want to hard-code your data. You ideally want to abstract it and read it from a file. In this lesson, we'll teach you how to read from a JavaScript Object Notation (JSON) file in Processing.

# What is JSON?

JSON is a format for storing data. It is identical to the code needed to create JavaScript Objects. Here's an example:

```javascript
{
    "employees":[
       {"firstName":"John", "lastName":"Doe"},
       {"firstName":"Anna", "lastName":"Smith"},
      {"firstName":"Peter", "lastName":"Jones"}
    ]
}
```
As you can see, the object is declared using curly braces `{}`, and the array is declared using square braces `[]`. JSON requires all pieces of data to be stored in the format of `key:value`. The key is usually a string, but it can be an integer or another data type.

# Reading JSON
So, we've got our JSON file all set up, let's use an example here:
```javascript
{
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

We structure this in a way to store the dialogue data, the 'successors' of the dialogue, and the options associated with the dialogue's successors. A successor is the next dialogue file to be read from, and the options will be used when there is more than one successor.

From here, we want to read the data within the `"data"` key. We can load a JSON object in Processing using `loadJSONObject("dialogue1.json");` This will create a new `JSONObject` that holds the data of the `dialogue1.json` file. From here, we use different methods to access data.

But... We're lazy! We don't want to write out code every single time to access `"data"`, so we should make some functions to do it for us! First, let's create a function to read the speaker of a given array index. 

```java
String getSpeaker(JSONObject obj, int index){
  return obj.getJSONArray("data").getJSONObject(index).getString("speaker");
}
```

We use the `getJSONArray()` method to get the array and get the `JSONObject` at the index we specify. Then we get the string with the key `"speaker"`.

Let's repeat this for the dialogue.

```java
String getDialogue(JSONObject obj, int index){
  return obj.getJSONArray("data").getJSONObject(index).getString("dialogue");
}
```

Pretty simple, right?

From here, we can get the successor array, and the options array.

```java 
JSONArray getSuccessors(JSONObject obj){
  return obj.getJSONArray("successors");
}
JSONArray getOptions(JSONObject obj){
  return obj.getJSONArray("options");
}
```

A reminder that these methods return `JSONArray`s, and not regular arrays! `JSONArray`s are different, requiring you to use methods to access values.

Finally, we'll create a method to figure out how many pieces of dialogue are in the file.
```java
int getDialogueLength(JSONObject obj){
  return obj.getJSONArray("data").size();
}
```
After this, we've got everything we need! We can now read the dialogue from JSON! We can also read what the next dialogue file is, and what options will be presented to the user.

Second on our `TODO` list, drawing characters!