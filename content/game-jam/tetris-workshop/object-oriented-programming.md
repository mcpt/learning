hug o+++
title = "Object Oriented Programming"
weight = 2
+++
---

### What is a class?
A `class` is a **user-defined data type** which can be used when primitive/basic data types (such as `int` or `char`) are not enough to satisfy the needs of the program. It allows the programmer to combine multiple primitive or user-defined data types into one single data type.

### What is an object?
An object is an **instance** of a `class`. Think of the `class` as the "blueprint" for the object. The `class` defines what types of data are going to be stored in the object.

##### Example: `Baby`
```python
class Baby:
    String name
    float length
    Date birthdate
```
To store the baby's birthdate, we will declare a separate class `Date`
```python
class Date:
    int year
    int month
    int day
```

A sample `Baby` object would look like:
```python
name: "Sally"
length: 20.1
birthdate: Date (year: 2021, month: 12, day: 25)
```

Syntax for the `Baby` class in Java or Processing would look like:
```java
class Baby {
    private String name;
    private float length;
    private Date birthdate;

    public Baby(String name0, float length0, Date birthdate0) {
        name = name0;
        length = length0;
        birthdate = birthdate0;
    }
}
```
The `Date` class would look like:
```java
class Date {
    private int year;
    private int month;
    private int day;

    public Baby(String year0, float month0, Date day0) {
        year = year0;
        month = month0;
        day = day0;
    }
}
```

To create a `Baby` object (an instance of the `Baby` class):
```java
Date birthdate = new Date(2021, 12, 25);
Baby myBaby = new Baby("Sally", 20.1, birthdate);
```

To access or modify the fields of an object in Java, you must either create "getter" and "setter" methods or declare the fields as `public` or `protected` to allow use of the `.` operator (not recommended since any class will be able to freely access the fields).
```java
class Baby {
    private String name; // Alternatively, you can declare these as public/protected instead of private
    private float length;
    private Date birthdate;

    public Baby(String name0, float length0, Date birthdate0) {
        name = name0;
        length = length0;
        birthdate = birthdate0;
    }

    // Gets the current name
    public String getName() {
        return name;
    }

    // Sets the name to a new name
    public void setName(String newName) {
        name = newName;
    }

    // Do this for any other fields that need accessing ...
}

public class Main {
    public static void main(String[] args) {
        Baby myBaby = new Baby("Sally", 20.1, new Date(2021, 12, 25));
        System.out.println("My baby's name is " + myBaby.getName());
        myBaby.setName("Samantha"); // Set a new name
        System.out.println("My baby's name is " + myBaby.getName());
    }
}
```

Documentation for classes and objects in Python can be found **<a href="https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables">here</a>**.

Sample implementation of the `Baby` and `Date` classes in Python. Remember that all Python instance methods **must** contain the parameter `self`.
```python
class Baby:
    # Any instance methods must contain the parameter "self"
    def __init__(self, name, length, birthdate):
        self.name = name
        self.length = length
        self.birthdate = birthdate

class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day
```

Getting and setting fields in Python can be done using the `.` operator.
```python
myBaby = Baby("Sally", 20.1, Date(2021, 12, 25))
print("My baby's name is", myBaby.name)
print("My baby's birth year is", myBaby.birthdate.year)

print("My baby is", myBaby.length, "inches long.")
myBaby.length += 1 # Baby grew by an inch
print("My baby is", myBaby.length, "inches long.")
```

Python has instance methods for classes as well. Here's an example:
```python
class Baby:
    # Any instance methods must contain the parameter "self"
    def __init__(self, name, length, birthdate):
        self.name = name
        self.length = length
        self.birthdate = birthdate
    
    # Display info about the baby
    def showOff(self):
        print("My name is", self.name + ". I am", self.length, "inches long, and I was born on", self.birthdate.to_string())

class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    # Convert the date to a readable string and return it
    def to_string(self):
        return str(self.year) + "-" + str(self.month) + "-" + str(self.day)

myBaby = Baby("Sally", 20.1, Date(2021, 12, 25))
myBaby.showOff()
```

Sample code can be found in the **[resource package](/game-jam/resources/tetris-workshop/_index.files/Tetris%20Workshop.zip)**.