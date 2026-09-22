> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.20.80?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:22.206Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.20.80 Update Notes for Creators

Minecraft Bedrock has been updated to 1.20.80 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Entities

- minecraft:body_rotation_blocked component - prevents an entity from visually rotating their body to match their own facing direction.

- is_sitting filter - checks if the entity is sitting.

- has_damaged_equipment filter - checks if the entity has a certain damaged piece of equipment in the specified slot.

## Molang

- query.armor_damage_slot - returns the damage value of the armor item in the specified slot.

## Camera

- Entity render distance improvements - Entities that a player is riding or attached to by a leash will now show on chunks that have been ticked.

## Commands

- HUD Command - Allow hiding and showing of various HUD elements.

- /titleraw & /tellraw - improved support of input key glyphs.

## Recipes

- assume_symmetry property for Shaped Recipes allows for symmetrical shaped recipes with different outputs.

## Creator API

Another set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.10.0 release:

- Block BlockComponentTypes

- Block getItemStack

- BlockPermutation getItemStack

- Entity EntityProjectileComponent

- EntityComponentTypes

- EntityComponent entity

- EntityTypeFamilyComponent

- EntityType

- EntityTypes

- Item Components ItemComponentTypes

- ItemCooldownComponent

- Music APIs Player playMusic

- queueMusic

- stopMusic

- World Initialize Events WorldInitializeAfterEvent

- WorldInitializeAfterEventSignal

- Structure APIs StructureManager createEmpty

- delete

- get

- place

- Structure id

- size

- getBlockPermutation

- getIsWaterlogged

- isValid

- StructureSaveMode

- StructureRotation

- StructureAnimationMode

- StructureMirrorAxis

- InvalidStructureError

- StructureCreateOptions

- StructurePlaceOptions

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.11.0-beta. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## What's Next

Looking ahead, here's what you can expect coming in future releases.

 Blocks

- Transform pivot point: Adding an additional pivot point attribute to facilitate rotation and scale operations.

- Block item config: Allowing setting the visual component of blocks as an icon or in-hand representation.

- UV Rotations: This allows you to rotate the specified uv rect in 90 degree increments before applying it to a block face

 Script API

- Game Rule & Gamemode APIs

- Block TypeID

- Player Interact Events

- Custom Components - allows extending Blocks and Items with the power of scripting. This is currently in experimental and we expect this to be stable in a couple of releases.

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
