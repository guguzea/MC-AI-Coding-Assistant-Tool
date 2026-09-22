> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.21.20?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:21.298Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.21.20 Update Notes for Creators

Minecraft Bedrock has been updated to 1.21.20 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Blocks

- Block Custom Components - Scripting APIs to handle the block event scenarios that were originally part of "Holiday Creator Features". random_tick

- on_step_on

- on_player_interact

- queued_tick

- on_step_off

- on_player_destroyed

- on_fall_on

- on_player_placing

- on_placed

## Entities

- minecraft:behavior.swim_up_for_breath is a newly exposed AI goal component, which allows a mob to try to move to a location where it can breathe air once it is close to running out of its breathable supply. In Vanilla, this is used by the Dolphin.

- Any custom content built off of the Vanilla dolphin at or above version 1.21.20 will need to manually add this component to enable this AI behavior

- behavior.teleport_to_owner is a goal, which allows an entity to teleport to its owner. This goal is designed for emergency situations where "behavior.follow_owner" could be too slow or too low priority

- The "filters" field allows defining the conditions for teleportation using entity filters

- The "cooldown" field allows defining how often the entity should attempt to teleport

- owner_distance is a new entity filter which checks the distance of an entity from its owner.

- wind_burst_on_hit is a new subcomponent for Projectiles which creates a wind burst upon collision with an entity or block before being removed from the world

## Items

- Item Custom Components - Scripting APIs to handle the item event scenarios that were originally part of "Holiday Creator Features". on_use

- on_use_on

- on_mine_block

- on_complete_use

- on_consume

- on_hit_entity

- Slot body armor for entities - Modify the interact component of the mob to equip them by putting armor in the mob's body slot.

- damage_absorption - When added along with durability and wearable to a custom item, that item will take damage when in the armor slot and not the player or entity. Does not work for items in hand.

- durability_sensor - By adding a damage_sensor component to any entity that will wear your custom armor, it will protect them from taking damage when that armor is worn. Doing this means the armor itself will also be undamaged.

- damage_sensor - Allows creators to set the sounds and particles that are emitted when items are damaged.

## Features (world decorations)

- scatter_feature - now has a "distribution" field like "minecraft:feature_rules" to define the scattering settings in format_version 1.21.10 and above.

## Molang

- query.state_time - Returns the time in seconds spent in the current animation controller state (inclusive of blend time).

## Creator API

Another set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.12.0 release:

- Tameable / Mount APIs EntityTamableComponent getTameItems

- tame

- tamedToPlayer

- tamedToPlayerId

- isTamed

- EntityTameMountComponent isTamed

- isTamedToPlayer

- tamedToPlayer

- tamedToPlayerId

- tameToPlayer

- PlayerInputPermission APIs PlayerInputPermissions

- Player inputPermissions

- InputPermissionCategory

- PlayerInputPermissionCategoryChangeAfterEvent

- PlayerInputPermissionCategoryChangeAfterEventSignal

- WorldAfterEvents playerInputPermissionCategoryChange

- Block Explode After Event APIs BlockExplodeAfterEvent

- BlockExplodeAfterEventSignal

- WorldAfterEvents blockExplode

- Game Rule: "Days Played" GameRule showDaysPlayed

- Enchantment Types EnchantmentTypes getAll

- Entity Raycast Options EntityRaycastOptions ignoreBlockCollision

- includeLiquidBlocks

- includePassableBlocks

- EntityHitBlockAfterEvent hitBlockPermutation

- Entity Movement APIs EntityLavaMovementComponent

- EntityUnderwaterMovementComponent

- EntityMovementGlideComponent

- EntityMovementSwayComponent

- EntityMovementComponent

- EntityAgeableComponent APIs EntityAgeableComponent duration

- growUp

- transformToItem

- getDropItems

- getFeedItems

- Job System APIs System runJob

- clearJob

- waitTicks

 APIs included in the @minecraft/server-ui version 1.2.0 release:

- Server UI ModalFormData submitButton

 APIs included in the @minecraft/server version 1.13.0 release:

- BlockPermutation Tags BlockPermutation getTags

- hasTag

- getTopMostBlock Dimension getTopmostBlock

- VectorXZ

Beta APIs will continue to be developed behind the Beta API experimental flag. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## What's Next

Looking ahead, here's what you can expect coming in future releases.

### Camera

- 3rd Person Preset - currently in experimental, this will add another camera preset type for use with the camera command and APIs.

- Focus Target - A new parameter allowing the Free Cam to track an entity.

- Aim Assist - A feature that allows for Aim Assist to improve usability in Custom Camera scenarios.

### Blocks

- Destructible_by_mining - This will allow creators to set the tool tiers for vanilla and custom blocks.

- Redstone properties and components - This will allow for access to customize Redstone connectivity.

- item_display_transforms is a new control for minecraft:geometry. This controls the way a block is visually represented in the UI, on the player, and floating on the ground. It exists inside minecraft:geometry, and requires format_version 1.21.20. The item_display_transforms element does require the "Upcoming Creator Features" experimental toggle.

### Script API

- Player Interact Events

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
