+++
title = "Currency System"
weight = 3
+++

---

{{%attachments style="green" title="Currency Template Code" /%}}

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

In Balloons.pde, we check if balloons have positive hp when they are drawn in drawBalloon(). Here, we have an if statement that checks if `balloon[hp] <= 0`, which means that the balloon has been popped (it has less than zero hp). We can add our method handleBalloonPop(), which will add money to the user’s balance once they pop a balloon. Here are the two methods `handleBalloonPop()` and `increaseBalance()` in Currency.pde.

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

The second method, `increaseBalance()` takes a parameter which is the amount that is to be added to the user’s balance.  For popping balloons, the user gets $20, which is set in the global variables section, `rewardPerBalloon.`

{{% expand "See code" "false" %}}
```java
// Current amount of money owned by the player
int currentBalance = 500; // Give the user $500 of starting balance
final int rewardPerBalloon = 20; // Money earned by popping a balloon
final int towerPrice = 100; // Price to purchase a single tower
```
{{% /expand %}}

For `handleBalloonPop()`, this method is called whenever a balloon is popped, so we just call `increaseBalance()` with the `rewardPerBalloon` in order to reward the user.

### Purchasing Towers
All the towers now have a price! Whenever the user picks up a tower, they will need to purchase it using their balance. Since the `handlePickUp()` method is called whenever the user picks up a tower, we will use it to charge the player when purchasing a tower and prevent them from picking up towers without sufficient money. When purchasing a tower, we first need to check if the player has enough money to purchase the tower. This can be done by comparing the player's current balance to the cost of the tower. The costs of the towers are stored in the towerPrice array.

{{% expand "See code for checking funds" "false" %}}
```java
/** Checks to see if there is sufficient balance for purchasing a certain item
 *  Parameter "cost" is the cost of the item to be purchased
 */
boolean hasSufficientFunds(int cost) {
  if (currentBalance < cost) {
    return false; // Not enough money to purchase the tower
  }
  else {
    return true; // Enough money to purchase the tower
  }
}
```
{{% /expand %}}

If the balance is greater than or equal to the cost of the tower, then allow the user to pick up the tower. The cost of that tower will be deducted from the player's balance once they drop the tower onto a valid location (not in the trash).

{{% expand "See code for purchasing tower" "false" %}}
```java
/** Purchases a tower
 *  Parameter "cost" is the cost of the tower to be purchased
 */
void purchaseTower(int cost) {
  currentBalance -= cost;
}
```
{{% /expand %}}

If the balance is less than the cost of the tower, we will not allow the tower to be picked up. 

{{% expand "See code for pick-up handling" "false" %}}
```java
// Will be called whenever a tower is picked up
void handlePickUp(int pickedUpTowerID) {
  // Only if there is sufficient money to purchase the tower...
  if (withinBounds(pickedUpTowerID) && hasSufficientFunds(towerPrice[pickedUpTowerID])) {
    // Pick up the tower
  }
}
```
{{% /expand %}}

### Insufficient Funds Warnings
To make it easier for the player, we will warn them whenever they try to purchase a tower that they don't have enough money for. To check if this is happening, we will first see if the user is clicking within the pick-up box. We will check the `mousePressed` variable and `withinBounds()` method to do so. Then we will check to see if the user has enough money, if they wanted to purchase the tower. We will use the `hasSufficientFunds()` method that we had previously implemented to see if they do. If both of these conditions are true, then we should colour the text red to warn the user that they have insufficient funds.

{{% expand "See code for funds warnings" "false" %}}
```java
// Checks to see if the user is attempting to purchase/pick up a tower but has insufficient funds
boolean attemptingToPurchaseTowerWithoutFunds(int towerID) {
  if (mousePressed && withinBounds(towerID) && !hasSufficientFunds(towerPrice[towerID])) {
    return true;
  }
  else {
    return false;
  }
}
```
{{% /expand %}}

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
First we check if they are trying to buy a tower without funds, since then we make the text turn red to warn the user that they do not have enough funds. We call the method that was written before, `attemptingToPurchaseTowerWithoutFunds()`, to check if the user doesn’t have enough money. This will return a boolean value (either `True` or `False`) to us, so we can put this in an if statement. If you check back above, it returns true when the user doesn’t have funds, so we change the fill colour to towerErrorColour (global variable in `Towers.pde` when towers are placed illegally) in the if block. Otherwise, we change the text back to the default black text. We can then display the balance, using the `text()` method.
