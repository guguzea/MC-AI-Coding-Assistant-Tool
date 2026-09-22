> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.21.100?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:18.419Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.21.100 Update Notes for Creators

 Video version of this article from the Minecraft Creator Channel

Minecraft Bedrock has been updated to 1.21.100 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Editor

 Editor v1.0.4
Editor has been updated with a number of quality-of-life features.

- Tool Tip GIFs

- Brush Rotation

- Pencil Tool

- Structure Drag and Drop

 Get started with Editor!

## Blocks

- Particle Count - When breaking a block, defines the quantity of particles that appear with a particle_count property on destruction particles.

- Textures - UV Locking (minecraft:geometry uv_lock) - This will make it so there is no longer a need to define new geo every time a texture is rotated.

- Moveable - Defines if block is immovable, pushable, or pullable by a piston.

- Random offset (minecraft:random_offset) - Defines a block to have a variable offset, allowing for the kind of randomization seen in dirt blocks.

## Entities

- minecraft:behavior.take_block AI goal allows an entity to take blocks from the world with various options.

- minecraft:behavior.place_block AI goal allows an entity to place blocks in the world with various options.

## Scripting

- Custom Commands - Similar to block and item custom components, this allows creation of custom slash commands via script.

- Player inventory events PlayerHotbarSelectedSlotChangeAfterEvent

- PlayerHotbarSelectedSlotChangeAfterEventSignal

- PlayerInventoryItemChangeAfterEvent

- PlayerInventoryItemChangeAfterEventSignal

- HotbarEventOptions

- InventoryItemEventOptions

- PlayerInventoryType

- Armor APIs EntityEquippableComponent totalArmor

- totalToughness

- Loc Key APIs - Access to localizationKey property for Block , Entity , Dimension , and ItemStack .

- Container.find APIs - An easier method to search the contents of a container. container contains

- firstEmptySlot

- firstItem

- find

- findLast

- DyeableItemComponent

- MovementType

- StickyType

- BlockMovableComponent

## What's Next

Looking ahead, here's what you can expect coming in future releases.

### What's Next for Camera

- FOV - This is a new parameter that will allow you to set a custom FOV for the custom camera presets as well as Vanilla cameras via commands and API.

- Aim assist, projectiles - The aim assist feature is expanded to support projectiles.

### What's Next for World Gen

- Jigsaw Block - All of the functionality currently available in experimental is coming to stable in an upcoming release.

- Improved Spawn rules - Allowing for customized mob spawning in biomes and structures.

- Biome replacement - All of the functionality currently available in experimental is coming to stable in an upcoming release.

## What's Next for Blocks

- Loot & destroy API - Allow reading loot tables through scripting. Apply different loot tables through scripting when destroying entity or block.

### What's Next for Script API, Molang and Commands

- Player apply impulse and clear velocity

- Book APIs

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
