> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.21.90?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:18.425Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.21.90 Update Notes for Creators

 Video version of this article from the Minecraft Creator Channel

Minecraft Bedrock has been updated to 1.21.90 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Editor

 Editor v1.0
We are excited to announce Editor v1.0.0! With this milestone Editor is officially out of beta. There are also a number of new features to highlight in this version.

- Updated Movement Controls

- Vibrant Visuals Settings Improvements

- Pick blocks by color in the Block Picker

- Hollow Selection Trim Action

- Line Tool Improvements

 Get started with Editor!

## Camera

- The /controlscheme command allows for selecting different control schemes that are more appropriate in 3rd Person camera scenarios. For example, over the shoulder is now unlocked by using the camera_relative control scheme with the follow_orbit preset.

## Blocks

- Custom Components V2 is now available with new capabilities.

- culling improvements - A subset of culling rules to support behaviors such as how leaves appear when configured in a tree with neighbor rules.

## Items

- Custom Components V2 is now available with new capabilities.

## Entities

- remove_in_peaceful component - determines whether an entity should despawn on "Peaceful" difficulty.

- Leash improvements: leashable_to

- New fields added to the leashable component. can_be_cut

- spring_type

- rotation_adjustment

- input_air_controlled

- body_rotation_always_follows_head - Ensures the entity's body is always aligned with the head.

- rideable improvements is_riding_self - returns true if the subject entity is riding the calling entity on which the filter is used

- is_vehicle_family - returns true when the subject entity is riding a vehicle with the specified family.

## Graphical

Vibrant Visuals is released! Many capabilities are available for creators to play with including:

- PBR textures

- Subsurface Scattering

- Atmospherics

- Per Biome Settings

- Water

- Shadows

- Color Grading and Tone Mapping

- Key Framing

 Get started with Vibrant Visuals!

You can also make Vibrant Visuals textures in Blockbench . Or you can use Editor to visualize Vibrant Visuals customization.

## Scripting

Scripting API v2.0.0 is released and includes a number of new APIs.
For an overview of Scripting API v2.0.0 please refer to this document. Scripting v2.0.0 API Overview

## UI

Some additional formatting options have been added to server-ui forms.

- Section Headers

- Labels

- Section Dividers

- Tooltips

## What's Next

Looking ahead, here's what you can expect coming in future releases.

### What's Next for World Gen

- Jigsaw Block - All of the functionality currently available in experimental is coming to stable in an upcoming releases.

- Improved Spawn rules - Allowing for customized mob spawning in biomes and structures.

## What's Next for Blocks

- particle intensity - When breaking a block, defines the quantity of particles that appear.

- Textures – UV locking - This will make it so there is no longer a need to define new geo every time a texture is rotated.

- Loot & destroy API - Allow reading loot tables through scripting. Apply different loot tables through scripting when destroying entity or block.

### What's Next for Script API, Molang and Commands

- Custom Commands - Similar to block and item custom components, this will allow creation of custom slash commands via script.

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
