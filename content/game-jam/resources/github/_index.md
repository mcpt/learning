+++
title = "A Github Crash Course"
weight = 1
+++
---
Brought to you by MCPT : )

![Banner](/img/game_jam_banner.png)

### What is Git & Github?
---
Git is a version control system which helps individuals as well as teams keep track of their code as it is created. Notable functions include reverting back to a previous state of code, creating a separate "branch" of code to add changes, and merging branches when changes are completed and tested. All in all, Git is something all developers should know. GitHub is an interface which makes it a lot easier to keep track of Git.

### Installation
---
The most basic way to use Git is by downloading it and using commands in a terminal, but there are also many tools that work with Git. Below are a couple of examples, but in the end the method to use Git will be up to personal preference.

### Making an Account
To use Git, you will need to make an account on the [GitHub website](https://github.com/). There, you will able to view all of your projects and repositories, and there are also some Git functions you can use on the website itself.

### Github Desktop for Windows & Mac

GitHub Desktop is an application which allows many GitHub functions to be utilized through a
graphical user interface. **It is easy to use and it displays all changes very nicely so if you are not
familiar with Git this would work well for you.** It does have its limitations so some commands
may still have to be executed through a terminal.

Download it [here](https://desktop.github.com/).

### Git Bash for Windows

When you install [Git for Windows](https://git-scm.com/download/win), it will come with its own terminal where you can run commands. [Here](https://www.stanleyulili.com/git/how-to-install-git-bash-on-windows/) is a tutorial on how to configure it.

### Linux Installation

If you are using a Linux OS, you can use your package manager to install Git by running `<package manager> install git-all` and then you will be able to use Git commands.

### Useful Commands
---

Here is a list of common commands that are used with Git. These are run in a terminal after Git has been installed locally. [Here](https://www.git-tower.com/blog/command-line-cheat-sheet/) you can find a list of essential terminal commands that are not Git-related but are useful to know when working in a terminal.

### Initialization & First Commit

**This section will address how to initialize a repository and make the first commit.**

```
git init
```
After navigating to the local folder of your project, running this command will create a `.git` folder, making it compatible with Git functions.
```
git add <file name>
git add .
```
This command adds the given file's changes, or in the case of `git add .` all changes, to the so-called staging area which stores all added changes to be committed.
```
git commit -m "commit message (hint: be descriptive)"
```
This is the command you run after you have made changes in the project directory and added them to the stage. This will not update the project on GitHub; commits are stored locally until they are pushed to the remote. You must have a message for this command to work.
```
git branch -M main
```
This will set the current branch to the main branch.
```
git remote add origin https://github.com/<your username>/<repository name>.git
```
This will link your local project to the remote repository, the term for project, on GitHub. **Make sure you make the repository on GitHub first using the + on the top right of the website**. You will only need to run this once.
```
git push -u origin main
```
This will set the upstream, or where your changes are going in your Git structure, so you can run commands without specifying where the changes are going every time, as well as send the current committed changes to the remote. The above example can be modified where `origin` can be replaced with another remote through the previous command and `main` can be replaced with another branch.

### Using an Existing Repository

**This section will address how to get a local instance of a repository.**

```
git clone https://github.com/<path to repository>
```
This will create a local instance of an existing repository locally. You will then be able to run Git commands in this repository. 

### Adding

**This section will go over some other commands which are useful in adding code to the remote as well as working with changes that are not local.**

```
git status
```
This command will display details about the local instance of the repository, such as changed files. The changed files are checked against the local information of the branch, not the remote one which may have been updated since the last pull (see `git pull`).
```
git fetch
```
This command will show changes that are in the remote that are not updated to the local instance, though it will not merge them in (see next command).
```
git pull <remote> <branch>
```
This command pulls pulls changes from the remote that are not local. Basically, if any changes were committed and then pushed from other local instances of the project, they will be merged in with the local files. Sometimes, this can cause conflicts if the same file has changes in the same place so watch out for that and make sure to resolve conflicts. If it was previously specified, `<remote>` (usually `origin`) and `<branch>` (usually `main`) do not need to be included, but adding them nonetheless will not leave any ambiguity.
```
git add .
git add <file name>
```
This command adds the given file's changes, or in the case of `git add .` all changes, to the so called staging area which stores all added changes to be committed.
```
git commit -m "commit message (hint: be descriptive)"
```
This is the command you run after you have made changes in the project directory and added them to the stage. This will not update the project on GitHub; commits are stored locally until they are pushed to the remote. You must have a message for this command to work.
```
git push <remote> <branch>
```
This is the standard command for pushing commits to the active branch. Remember to use the add and commit commands before pushing as the push command only pushes committed changes. The same comment about ambiguity as with `git pull` can be made about this command. 

### Branches

**Although not required for most basic projects, a useful feature of Git is branches. They can be used to make the development process more organized by separating operations into segments and then merging them into the main branch. Below are some useful commands to utilize branches. Additionally, the merging of branches is usually done on the GitHub website using pull requests.**
```
git branch <new branch name>
git branch -d <branch to delete>
```
This command creates a new branch. It does not check it out (see next command). If the `-d` argument is added, this command will delete the branch specified.
```
git checkout <branch name>
git checkout -b <new branch name>
```
This command checks out a branch with the name specified. If the argument `-b` is added, then a new branch is created with the provided name and is checked out. By checking out a branch, it becomes active, and any pushes, pulls, and commits are going to be made in relation to that branch unless otherwise specified. 

### .gitignore
You can create a file called `.gitignore` in your project folder. Within this file, anything you list a path to, such as a file or folder, will be ignored by Git, which means that changes will not be seen if it is already part of the git structure or if it is new it will not be seen at all. 

### Other Resources
---
* [Cheat sheet](https://training.github.com/downloads/github-git-cheat-sheet/)
* [Youtube playlist](https://www.youtube.com/watch?v=xAAmje1H9YM&list=PLeo1K3hjS3usJuxZZUBdjAcilgfQHkRzW)
* [Git documentation](https://git-scm.com/docs)
* [Github documentation](https://docs.github.com/en/github)