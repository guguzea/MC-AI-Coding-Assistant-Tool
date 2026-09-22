> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.19.80?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:24.822Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.19.80 Update Notes for Creators

Minecraft Bedrock has been updated to 1.19.80 and there are a number of changes of note for creators.

## Holiday Creator Features

No existing Holiday Creator Features left experimental this release. But two new components were added, replacing previous Holiday Creator Features.

- transformation - replaces the previous block rotation component (and adds scaling and translation)

- bone_visibility - added to the geometry component and replaces the previous part_visibility component

## Components

 New Block Transformation Component

Added a new transformation component for blocks to support rotation, scaling and translation. The component can be added to the whole block, and/or to individual block permutations .

```JSON
"minecraft:transformation": {
 "translation": [0.0, 0.1, -0.1],
 "scale": [0.5, 1, 1.5],
 "rotation": [90, 180, 0]
}
```

 bone_visibility

Added a new bone_visibility element to the block geometry component.

## Commands

 New Command: inputpermission

Added the inputpermission command, which allows for setting the player's camera or movement as enabled or disabled. This will be handy in cutscenes and non-interactive sequences.

`/inputpermission set `

 Improved Command: summon

Added two new overloads to the summon command to make it easier to summon entities at specific rotations.

`/summon [spawnPos : x y z] facing [spawnEvent: string] [nametag: string]`

`/summon [spawnPos : x y z] facing [spawnEvent: string] [nametag: string]`

 Auto-complete support for block states

In 1.19.70, we removed support for field "data" in the following commands:

- /clone

- /execute

- /fill

- /setblock

- /testforblock

In 1.19.80, we've added auto-complete support for block-states to make it easier to use this syntax.

 Example:

No longer supported:

`/setblock ~ ~ ~ minecraft:wool 1`

Supported:

`/setblock ~ ~ ~ minecraft:wool ["color":"orange"]`

## Creator API

A second set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs ). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.1.0 release:

- Vector3

- System runTimeout

- runInterval

- clearRun

- currentTick

- Reading Basic Block properties BlockPermutation (only a subset)

- Block

- getBlock

- Basic messaging sendMessage

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.2.0-beta. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
