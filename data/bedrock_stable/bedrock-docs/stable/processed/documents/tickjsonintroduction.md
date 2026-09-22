> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/tickjsonintroduction?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:41.802Z
> 警告：此文档可能滞后于当前正式版

# Introduction to tick.json

While command blocks are great for running a series of commands based on in-game events, Minecraft: Bedrock Edition offers the ability to use the in-game tick function to repeatedly run a series of functions by using a file called tick.json . `tick.json` is stored in the functions folder of a behavior pack next to the files containing the functions you want to run.

`tick.json` uses the gameplay tick which is 20 ticks per second, as opposed to the redstone tick which is 10 ticks per second.

Important

Unlike repeating command blocks, `tick.json` will execute commands before the world has fully loaded in. This might cause unintended behavior if you do not plan function usage carefully.
Be cautious not to run too many commands every tick, as it could affect performance, especially in low-end devices.

In this tutorial you will learn the following:

- How to create the tick.json file

- How to use tick.json to run functions.

### Requirements

It's recommended that the following be completed before beginning this tutorial:

- Introduction To Behavior Packs

- Introduction to Commands

- Introduction to Functions

You will also need the following:

- Your own behavior pack folder that already contains a manifest.json file.

- A Minecraft world with cheats enabled.

## Setting up the Functions Folder

The tick.json file contains the names of functions that you want to run every tick. Before creating `tick.json`, you will need to have functions for it to run. This example creates two function files to demonstrate how `tick.json` calls the files repeatedly.

- If you don't already have one create a folder inside your behavior pack and name it functions . This folder should be on the same level as your manifest.json file.

- Open the functions folder and create a text file.

- Name the file function_say_one.mcfunction .

- Open the file and enter say one on the first line.

- Save the file.

- Create another function file and name it function_say_two.mcfunction .

- Open the file and enter say two on the first line.

- Save the file.

Now there are two files for `tick.json` to call.

## Creating tick.json

The `tick.json` file contains a list of the functions that you want to execute on every tick of the game. You can also set the order that the functions will be called.

- Inside the functions folder, create a text file and name it tick.json .

- Copy the following text and paste it into your tick.json file. Save the file.

```json
 {
 "values": [
 "function_say_one", "function_say_two"
 ]
 }
```

The `tick.json` file uses only the `values` key, and the values are the names of the functions to run, without the .mcfunction extension.

## Testing the file

Launch Minecraft and activate the behavior pack.
When the world loads, there will be repeated messages displayed on the screen from [Server] .

`tick.json` files are additive and multiple will run if they exist in multiple behavior packs. For example, if the behavior pack stack has multiple behavior packs, all functions in `tick.json` will be run every tick.

## What's Next?

 Block JSON Documentation

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
