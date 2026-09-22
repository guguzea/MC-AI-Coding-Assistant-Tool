> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.21.40?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:20.547Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.21.40 Update Notes for Creators

Minecraft Bedrock has been updated to 1.21.40 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Hardcore Mode

Hardcore mode has released on Bedrock and creators can use this new game mode in their content.

The isHardcore API can be used by creators to determine whether the world is being run in the hardcore game mode.

## Blocks

- Redstone Conductivity - This component specifies whether a block conducts a redstone signal.

## Entities

- minecraft:explode has been expanded with additional fields: damage_scaling, toggles_blocks, knockback_scaling, particle_effect, sound_effect, negates_fall_damage, and allow_underwater.

- minecraft:damage_sensor - The "deals_damage" field has been changed from a Boolean to supporting three values to allow for a new capability to apply side-effects of an attack, but avoid direct damage.

- minecraft:home restriction_type - allows defining how an entity is restricted to its home position.

- minecraft:dimension_bound - prevents entities from changing dimension through portals.

- minecraft:transient - entities with this component will never be saved.

## Items

Custom Bundle items can be made by creators with two new components that are meant to work together:

- bundle_interaction - enables the bundle-specific interaction scheme and tooltip for an item.

- storage_item - turns the item into a dynamic container for storing items.

## World Gen

- minecraft:single_block_feature - This feature allows you to determine blocks that get placed randomly at at world gen, with random orientations and parameters as part of their placement, all in one schema. Solving the problem of needing a custom block for each rotation.

## Camera

- 3rd Person Follow Orbit Preset - The follow orbit preset lets you 'attach' the camera to a player, apply an offset, and set a variable radius (distance from player) and rotation.

## Commands

- Effect Command changes Added infinite duration option to Effect command.

- Added specific effect removal option to Effect command.

- Schedule Command clear - Clears all queued functions matching the given name.

- on_area_loaded clear function - Clears all queued functions that are scheduled as on_area_load by name.

- on_area_loaded clear ticking area - Clears all queued functions that are scheduled as on_area_load by ticking area name (and optionally also checks function name too)

## Creator API

Another set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs).

 APIs included in the @minecraft/server version 1.15.0 release:

- Hardcore Mode APIs World isHardcore

- EntityBreathableComponent breathesAir

- breathesLava

- breathesSolids

- breathesWater

- generatesBubbles

- inhaleTime

- suffocateTime

- totalSupply

- componentId

- getBreatheBlocks

- getNonBreatheBlocks

- Player Interact APIs WorldAfterEvents playerInteractWithBlock

- playerInteractWithEntity

- WorldBeforeEvents playerInteractWithBlock

- playerInteractWithentity

- Block Volume APIs BlockLocationIterator

- BlockVolumeIntersection

- BlockVolume

- BlockVolumeBase

- ListBlockVolume

- Redstone APIs Block getRedstonePower

## What's Next

Looking ahead, here's what you can expect coming in future releases.

### What's Next for World Gen

- Jigsaw Block - the UI for the Jigsaw block has been updated to allow it to connect to structure data. This connection and structure data is coming in future releases.

- /place feature - A command that allows placing of features.

### What's Next for Camera

- 3rd Person Boom Preset - currently in experimental, this will add another camera preset type for use with the camera command and APIs.

- Focus Target - A new parameter allowing the Free Cam to track an entity.

- Aim Assist - A feature that allows for Aim Assist to improve usability in Custom Camera scenarios.

### What's Next for Blocks

- Destructible_by_mining - This will allow creators to set the tool tiers for vanilla and custom blocks.

### What's Next for Script API, Molang and Commands

- Platform Information APIs - Script APIs and Molang queries to understand the memory, platform type, and performance capabilities of server and/or client.

- Input APIs - Script APIs and Molang queries that detection of some input events.

- /schedule delay - A command that queues a function to be executed after a certain amount of time.

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
