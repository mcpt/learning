+++
title = "Object Oriented Programming"
weight = 2
+++
---

### What is a class?
A `class` is a **user-defined data type** which can be used when primitive/basic data types (such as `int` or `char`) are not enough to satisfy the needs of the program.

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

