+++
title = "Writing Dialogue"
weight = 4
+++
Alright, so we know how to display dialogue using JSON files, but what good is that without some actual dialogue?

# Strategies

Okay so obviously there is not one single way to write dialogue. It will always take some creativity that cannot really be taught, however, we can provide suggestions for how to write a whole visual novel's worth of dialogue.

# Organization and Planning

It's important to stay organized.

```
1. Mackenzie: Oh sorry, did I keep you waiting? [NAME], right?
Options: 
	Yep, that's me. (2)
	Who? (3)
	MCPT, right? (4)
	No. (3)
```
Here we have an example of what the planning document for our demo looked like. We have this first option here along with some dialogue, however the most important part are the options. All of the player options have a number next to them. These numbers show what number dialogue is the "successor" for that option. In Google Docs, you can add hyperlinks to different headings for ease of going between options and following paths.

This format also makes the transition to JSON files quite easy, since your successors array is essentially already made for you. It also prevents dialogue trees from becoming so complex that they become impossible to navigate.

# Other Tips
Looking to other games may prove useful to see how dialogue is written. If there's a visual novel-type game you enjoy and think has good dialogue, it might be useful to use that structure as a basis for your own. Seeing what a good story looks like can help make yours better.

Other people are also incredibly helpful. If you're unsure of something, maybe ask someone to say the dialogue with you out loud, playing different characters. Even if you choose not to do that, a second set of eyes is always useful.

# Conclusion

So, we have some dialogue! Our game now has a well written story that is uniquely yours and is theoretically now a complete visual novel. Good job!
<!--more-->
