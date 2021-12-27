+++
title = "Multi-Threading"
weight = 4
+++
---

### Threads
A thread in a program is a task. All programs have a "main" thread which controls everything that happens, including separate threads. Separate threads run alongside the main thread, similar to multitasking.

In Java, threads are objects that can be created from the `Thread` class. To do so, you need to create a `subclass` of the `Thread` class.

Threads in Java require two things: a constructor and a `run()` method. The constructor initializes any fields you would need in the thread, and the `run()` method is what is run when the thread is started. A sample thread is shown below.

```java
public class MyThread extends Thread // Create a subclass of Thread
{
    /* Any fields/variables */

    public MyThread(/* Any arguments... */) {
        /* Initialize fields */
    }

    public void run() {
        // What to do when the thread starts
    }
}
```

To start this thread, create an object/instance of your `Thread` subclass and call the `start()` method.

```java
MyThread thread1 = new MyThread(/* Any arguments */);
thread1.start(); // Start the thread
// ... 
thread1.stop(); // Stop the thread
```

Processing has its own `thread` interface separate from Java. The official documentation from Processing can be found **<a href="https://processing.org/reference/thread_.html">here</a>**. Processing threads only require you to reference the name of the method that should be run when the thread starts.

Python has a `multiprocessing` module that has the same functionalities as threads. Documentation can be found **<a href="https://docs.python.org/3/library/multiprocessing.html">here</a>**.

Here is a sample use of Python `multiprocessing`:
```python
from multiprocessing import Process

def what_to_run("""Any arguments"""):
    # What to run when the process starts

myProcess = Process(target = what_to_run, args(""" Any arguments for the function call """))
myProcess.start()
myProcess.wait(5) # Wait (at most 5 seconds) for the process to finish. If it doesn't finish, raise an exception
myProcess.terminate() # Force stop of the process using SIGTERM
```
