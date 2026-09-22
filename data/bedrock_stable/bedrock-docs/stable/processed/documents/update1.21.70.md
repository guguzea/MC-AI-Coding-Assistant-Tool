> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.21.70?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:19.459Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.21.70 Update Notes for Creators

Minecraft Bedrock has been updated to 1.21.70 and there are a number of changes of note for creators. The following features do not require experimental toggles.

 Video version of this article from the Minecraft Creator Channel

## Editor

 Editor v0.9 The Realms Update

Editor is now available on stable builds and is accessible via the Minecraft Launcher on Windows PC.

Editor v0.9 added a number of new capabilities including:

- Realms integration

- Grid Repeat

- Updated Structure Management

- Updated Extrude Visualization

 Get started with Editor!

## Platform

- Input APIs - Script APIs to detect player input & modes: InputButton

- ButtonState

- InputInfo getButtonState

- getMovementVector

- Sound Locators on Entities

## Blocks

- Loot table - Item tags that support "match_tool" move out of experimental.

- Liquid APIs - Moved from beta to stable LiquidType

- Block canBeDestroyedByLiquidSpread

- isLiquidBlocking

- liquidSpreadCausesSpawn

- liquidCanFlowFromDirection

- canContainLiquid

- BlockPermutation canBeDestroyedByLiquidSpread

- isLiquidBlocking

- liquidSpreadCausesSpawn

- canContainLiquid

- replaceable - Define a block as "squashable" by another block (a block placed on another block replaces that block without a drop).

## Entities

- Player spawn particle Player.spawnParticle

## Camera

- Aim Assist - Functionality to target blocks, entities, custom tinting, and custom colors per player no longer behind an experimental toggle.

- 3rd person presets & improvements- The second preset is no longer experimental.

## World Generation

- Structure loading - It is now possible for structures to load in unloaded chunks.

- /place structure with entity - Entity placement works with place structure command.

## What's Next

Looking ahead, here's what you can expect coming in future releases.

### What's Next for World Gen

- Jigsaw Block - All of the functionality currently available in experimental is coming to stable in the upcoming releases.

- /place feature - A command that allows placing of features.

- Improved Spawn rules - Allowing for customized mob spawning in biomes and structures.

### What's Next for Camera

- Over-the-shoulder style orbit preset

- Camera-relative player control schemes

## What's Next for Blocks

- Data-Driven biome tinting - Supports block textures per biome.

- destruction_particles - This represents the particles used when the Block is destroyed

- Isotropic textures - Allows for random rotation of textures (e.g. vanilla dirt).

- Destruction particle - Set a texture that appears when block is broken.

- particle intensity - When breaking a block, defines the quantity of particles that appear.

- Textures – UV locking - This will make it so there is no longer a need to define new geo every time a texture is rotated.

- Loot & destroy API - Allow reading loot tables through scripting. Apply different loot tables through scripting when destroying entity or block.

- Culling rules - A subset of culling rules will be delivered to support behaviors such as how leaves appear when configured in a tree with neighbor rules.

### What's Next for Script API, Molang and Commands

- server-ui - Improvements to sever-ui forms allowing for more formatting options.

- Scripting 2.0 changes - See Scripting 2.0 Overview for more information.

- Custom Commands - Similar to block and item custom components, this will allow creation of custom slash commands via script.

- Custom Components V2 - Allowing block and item custom components to pass parameters specifying properties via script.

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
