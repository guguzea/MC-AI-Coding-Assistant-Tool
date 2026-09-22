> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.21.60?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:20.896Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.21.60 Update Notes for Creators

Minecraft Bedrock has been updated to 1.21.60 and there are a number of changes of note for creators. The following features do not require experimental toggles.

 Video version of this article from the Minecraft Creator Channel

## Editor

 Editor v0.8.5 The Sculpting Update

Editor is now available on stable builds and is accessible via the Minecraft Launcher on Windows PC.

Editor v0.8.5 added a number of new capabilities including:

- Workbench tool

- Roughen Brush

- Night vision

- Updated Action Bar Items

- Updates to fly speed and compass

- Lots of small improvements and bug fixes

 Get started with Editor!

## Input APIs

- Molang queries to detect player input & modes: Input Mode (Gamepad, KeyboardAndMouse, MotionController, Touch, Unknown)

- query.last_input_mode_used

- query.touch_only_affects_hotbar

- query.last_input_mode_is_any

- Script APIs to detect player input & modes: InputMode

- InputInfo lastInputModeUsed

- touchOnlyAffectsHotbar

- Player inputInfo

- PlayerInputModeChangeAfterEvent

- WorldAfterEvents playerInputModeChange

- Improvements to Input APIs to allow for InputPermission toggling of: LateralMovement, Sneak, Jump, Mount, Dismount, MoveForward, MoveBackward, MoveLeft, and MoveRight. This includes: inputpermission command

- InputPermissionCategory script API enums

## Blocks

- ambient_occlusion - field can now be float type.

- ambient_occlusion_exponent - replaces broken "brightness_gamma" field in blocks.json schema.

- Block Item - Improvements to how custom blocks and block-items look and render in the game. minecraft:item_visual

- block_placer

- liquid_detection - Controls the basic liquid detection properties of a block, such as liquidlogging, liquid blocking, and being broken or popped by liquid spread. The only liquid currently supported by the component is water.

- Block / Water Interaction APIs LiquidType (enum)

- Block canBeDestroyedByLiquidSpread

- isLiquidBlocking

- liquidSpreadCausesSpawn

- liquidCanFlowFromDirection

- BlockPermutation canBeDestroyedByLiquidSpread

- isLiquidBlocking

- liquidSpreadCausesSpawn

## Items

- Compostable component and API - Allows composter to take minecraft:crop tagged items.

- Creative inventory order - Block and item order improvements allow custom blocks to be shown in the inventory alphabetically and supports nested blocks and items.

## Entities

- The minecraft:breedable component now has a field that enables the offspring's minecraft:color attribute to be a blend of the parents' "minecraft:color". "combine_parent_colors", If a color mutation will not happen, the baby will get a combination of the parents' colors if the colors are compatible. Color combinations follow the rules of DyeItem combinations. If the colors are not compatible the baby will get one of the parents colors chosen randomly

- New entity filter [home_distance], which checks the distance of an entity from its home.

- New entity filter [is_bound_to_creaking_heart], which checks if the Creaking Heart that spawned the subject Creaking still exists

## Camera

- Focus Target - The command and JSON functionality moves to stable.

## Commands

- /loot Command - The mine overload that allows for custom loot tables for custom blocks is fully released.

- Added support for input glyph replacement in /me and /tell commands. For example, using input string ":_input_key.jump:" will be replaced with "JUMP" when using keyboard, or an emoji in case of using a gamepad.

## What's Next

Looking ahead, here's what you can expect coming in future releases.

### What's Next for World Gen

- Jigsaw Block - All of the functionality currently available in experimental is coming to stable in the upcoming releases.

- /place feature - A command that allows placing of features.

- /place structure with entity - Entity placement works with place structure command.

- Improved Structure loading - Making it possible for structures to load in unloaded chunks.

### What's Next for Camera

- 3rd Person Boom Preset - currently in experimental, this will add another camera preset type for use with the camera command and APIs.

- Aim Assist - A feature that allows for Aim Assist to improve usability in Custom Camera scenarios.

## What's Next for Items

- Item tags - Support for custom item tags so creators can match tools to block breaking speeds and loot tables.

### What's Next for Script API, Molang and Commands

- server-ui - Improvements to sever-ui forms allowing for more formatting options.

- Input APIs - Additional APIs allowing for detecting player input.

- Scripting 2.0 changes - See Scripting 2.0 Overview for more information.

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
