+++
title = "Health Bar"
weight = 3
+++

---

### Reward for Balloon Pop

Since we have a working system to send balloons, the next step is to reward the user when they pop balloons. 

{{% expand "See code" "false" %}}
```java
void drawBalloons() {
    for (int i = 0; i < balloons.size(); i++) {
        float[] balloon = balloons.get(i);
        updatePositions(balloon);
        if (balloon[hp] <= 0) {
        handleBalloonPop(); // the balloon has been popped by a tower
        
        balloons.remove(i);
        i--;
        continue;
        }
        if (atEndOfPath(balloon[distanceTravelled])) {
        balloons.remove(i); // Removing the balloon from the list
        health--; // Lost a life.
        i--; // Must decrease this counter variable, since the "next" balloon would be skipped
        // When you remove a balloon from the list, all the indexes of the balloons "higher-up" in the list will decrement by 1
        }
    }
}
```
{{% /expand %}}

In Balloons.pde, we check if balloons have positive hp when they are drawn in drawBalloon(). Here, we have an if statement that checks if `balloon[hp] <= 0`, which means that the balloon has been popped (it has less than zero hp). We can add our method handleBalloonPop(), which will add money to the user’s balance once they pop a balloon. Here are the two methods handleBalloonPop() and increaseBalance() in Currency.pde.

{{% expand "See code" "false" %}}
```java
void handleBalloonPop() {
// Reward the player for popping the balloon
increaseBalance(rewardPerBalloon);
}


void increaseBalance(int amount) {
currentBalance += amount; // Increase the current balance by the amount given
}
```
{{% /expand %}}

The second method, increaseBalance takes a parameter which is the amount that is to be added to the user’s balance.  For popping balloons, the user gets $20, which is set in the global variables section, `rewardPerBalloon.`

{{% expand "See code" "false" %}}
```java
// Current amount of money owned by the player
int currentBalance = 500; // Give the user $500 of starting balance
final int rewardPerBalloon = 20; // Money earned by popping a balloon
final int towerPrice = 100; // Price to purchase a single tower
```
{{% /expand %}}

For handleBalloonPop(), this method is called whenever a balloon is popped, so we just call increaseBalance with the rewardPerBalloon in order to reward the user.


### Displaying Funds

{{% expand "See code" "false" %}}
```java
// Displays the user's current balance on the screen
void drawBalanceDisplay() {
  // If the user is attempting to purchase a tower without funds, warn them with red display text
  if (attemptingToPurchaseTowerWithoutFunds()) {
    fill(towerErrorColour); // Red text
  }
  else {
    fill(0); // Black text
  }
  
  text("Current Balance: $" + currentBalance, 336, 65);
}
```
{{% /expand %}}
First we check if they are trying to buy a tower without funds, since then we make the text turn red to warn the user that they do not have enough funds. We call the method that was written before, `attemptingToPurchaseTowerWithoutFunds()`, to check if the user doesn’t have enough money. This will return a boolean value (either **True** or **False**) to us, so we can put this in an if statement. If you check back above, it returns true when the user doesn’t have funds, so we change the fill colour to towerErrorColour (global variable in `Towers.pde` when towers are placed illegally) in the if block. Otherwise, we change the text back to the default black text. We can then display the balance, by using the text() method.
