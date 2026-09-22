> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/functionsintroduction?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:41.571Z
> 警告：此文档可能滞后于当前正式版

# Introduction to Functions

Commands are powerful tools for adding logic and gameplay features. However, redstone and command blocks can be cumbersome. With function files, you can group together multiple commands into a single file and execute all of them with a single command.

Tip

Minecraft: Bedrock Edition cannot run more than 10,000 commands in one function call.

In this tutorial you will learn the following:

- How to create a function file.

- How to use a function file in-game.

### Requirements

It's recommended that the following be completed before beginning this tutorial:

- Introduction To Behavior Packs

- Introduction to Commands

You will also need the following:

- Your own behavior pack folder that already contains a manifest.json file.

- A Minecraft world with cheats enabled.

## Setting up the Functions Folder

Function files have a .mcfunction extension and they live in the functions folder of your behavior pack.

- Start by creating a folder inside your behavior pack and name it functions . This folder should be on the same level as your manifest.json file.

- Open the functions folder and create a text file.

- Name the file ouch.mcfunction .

- Open the file, then copy and paste the following code into it: ```json say Bye... playsound random.explode teleport @s ~10 ~10 ~10 true say OUCH! ```

- Save the file.

Important

When working with commands in a .mcfunction file, you do not need to start commands with the leading slash `/`.

## Testing the function

- Launch Minecraft.

- Open a world with cheats enabled and the behavior pack you created applied to it.

- Enter /function ouch .

## Advanced function feature

You can place functions inside directories to organize them and to avoid conflicts with functions in other behavior packs.

For example, if you have another folder inside your functions folder called init and you put `ouch.mcfunction` in there, you would run it like this:
`/function init/ouch`

## What's Next?

Now that you have an overview of how a function file works, you can learn how to use the in-game tick function and a `tick.json` file to fire off custom functions on repeat.

 Tick.json Introduction

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
