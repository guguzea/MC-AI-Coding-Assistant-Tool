> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.19.50?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:26.087Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.19.50 Update Notes for Creators

Minecraft Bedrock has been updated to 1.19.50 and there are a number of changes of note for creators!

 Creator API:

It's a big day! Some initial APIs have been released out of experimental in a new stable track which opens up the Creator API to be used without the experimental Beta APIs flag.

APIs included in the @minecraft/server version 1.0.0 release:

- System.run

- World getAllPlayers()

- getDimension()

- MinecraftDimensionTypes

- Dimension id

- runCommandAsync()

- CommandResult

- Entity id

- typeId

- dimension

- runCommandAsync()

- Player name

This initial set is small, but more APIs will release in the coming months. Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.1.0-beta. But for the released APIs, these should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support. Read more about script versioning in this new article.

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

 /execute:

The new /execute command syntax has released out of experimental. This syntax brings the Bedrock execute command closer to Java. If you are using execute in command blocks you will need to modify those command blocks to update to the new command syntax. This new syntax requires your min engine version to be set at 1.19.50. Not ready to switch? You can stay on the old syntax by using an older min engine version.

Included in this new syntax:

- Conditions: if/unless score, if/unless entity, if/unless blocks

- Facing, Aligned, Rotated, Anchored, In

Documentation on the new execute syntax is available here: New /execute command syntax

 Block Components:

Two additional block components from the "Holiday Creator Features" experiment have released.

- Collision_box

- Crafting_table

Collision box in particular pairs nicely with the custom geometry component from 1.19.40. The Minecraft Block Wizard is being updated to use the collision box component allowing creators to select from pre-defined collision box sizes.

 Entity Properties:

Entity Properties has been released from experimental. Documentation on this feature is available here: Introduction to Entity Properties .

 Structure Block Import:

A new Import button on the Structure Block UI screen on Windows platforms allows direct importing of structure blocks in-game. Convenient!

Check it out in our documentation here: Structure Mode Load Mode

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
