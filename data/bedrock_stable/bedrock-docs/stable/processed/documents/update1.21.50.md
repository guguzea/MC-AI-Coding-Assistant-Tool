> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.21.50?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:19.984Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.21.50 Update Notes for Creators

Minecraft Bedrock has been updated to 1.21.50 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Editor

 Editor v0.8 The Sculpting Update

Editor is now available on stable builds and is accessible via the Minecraft Launcher on Windows PC.

Editor v0.8 added a number of new capabilities including:

- Sculpting tools: Flatten , Fill , Extrude , Repeater

- Farm tool

- Compass & Fly Speed

- Improved Block Picker

 Get started with Editor!

## Blocks

- minecraft:block_placer - Use this item component to render the referenced block as the item icon.

- Destructible_by_mining - This allows creators to set the tool tiers for vanilla and custom blocks.

## Entities

- minecraft:cannot_be_attacked - When added to an entity it prevents other entities from attacking it unless they fulfill an exception filter, in vanilla it is added to Ghasts, creators can add their entities to the exception filter allowing them to then attack Ghasts.

- minecraft:ignore_cannot_be_attacked - This allows content to have custom mobs which bypass the 'cannot_be_attacked' component (for example the one on the Ghast) without requiring a modification of the attacked mob's settings.

- behavior.summon_entity - lets creators specify an event to be invoked on the summoned entity immediately after summon.

- play_sound - this entity event response allows the owner entity to emit sounds

- emit_particle - this entity event response allows particles to be emitted at the center of the entity's bounding box.

## World Gen

 Biome Music & Audio

- Per-biome ambient sounds are now defined in client_biome JSON components using the new minecraft:ambient_sounds component.

- Client biome JSON files now support a minecraft:biome_music component with a "volume_multiplier" field which will gradually affect music volume when the audio listener is inside the corresponding biome.

## Commands

- /schedule delay - Queue a function to be executed after a certain amount of time.

## Molang

Device Info Queries - The following Molang queries that return platform/device information is now stable:

- query.client_memory_tier

- query.server_memory_tier

- query.client_max_render_distance

## Creator API

Another set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs).

 APIs included in the @minecraft/server version 1.16.0 release:

- Block Liquid APIs FluidContainer

- BlockFluidContainerComponent

- Device Info APIs ClientSystemInfo

- MemoryTier

- PlatformType

- SystemInfo

- Block Fill APIs BlockFillOptions

- UnloadedChunksError

- Dimension containsBlock

- getBlocks

- fillBlocks

- ItemUse Event API Improvements ItemUseOnBeforeEvent isFirstEvent

- ItemUseOnAfterEvent isFirstEvent

## What's Next

Looking ahead, here's what you can expect coming in future releases.

### What's Next for World Gen

- Jigsaw Block - All of the functionality currently available in experimental is coming to stable in the upcoming releases.

- /place feature - A command that allows placing of features.

### What's Next for Camera

- 3rd Person Boom Preset - currently in experimental, this will add another camera preset type for use with the camera command and APIs.

- Focus Target - A new parameter allowing the Free Cam to track an entity.

- Aim Assist - A feature that allows for Aim Assist to improve usability in Custom Camera scenarios.

### What's Next for Blocks

- Block Item Config - improvements to block item config settings.

- Liquid - Improvements to liquid detection and waterlogging APIs.

### What's Next for Script API, Molang and Commands

- Input APIs - Script APIs and Molang queries that detection of some input events.

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
