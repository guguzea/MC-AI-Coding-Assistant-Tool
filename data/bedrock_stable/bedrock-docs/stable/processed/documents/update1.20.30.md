> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.20.30?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:23.462Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.20.30 Update Notes for Creators

Minecraft Bedrock has been updated to 1.20.30 and there are a number of changes of note for creators. This release includes features that were planned for 1.20.20. The following features do not require experimental toggles.

## Commands

The /camera command gives creators control over custom camera. This release focuses on the `minecraft:free` camera preset. Learn how to use this preset here: Camera Command Tutorial - Free Camera Preset

Additional presets and more camera capabilities are planned for the future.

The /scriptevent command provides a bridge between script and command logic.

The /recipe command allows for locking and unlocking of individual Vanilla recipes. The `recipesunlock` game rule was added to limit crafting to unlocked recipes. It can be set through the /gamerule command .

## Blocks

 Block Traits

 Block Traits are intended as a shortcut for creators to add Vanilla BlockStates and setter functions to data-driven blocks.

For example:

- By using the minecraft:placement_direction trait to set the minecraft:cardinal_direction state, you can create a custom furnace block that will orient so the front is facing the player.

- By using the minecraft:placement_position trait to set the minecraft:block_face (the face the block was placed on) and minecraft:vertical_half (if a block was placed on the top or bottom) states, you can easily create blocks that behave like slabs or trapdoors.

## World Gen

 Random Seed
Marketplace maps can now specify map templates to allow for random world seeds.

See: Create A World Template .

 Custom Feature Placement
Several feature placement rules have released to give creators more world-gen capability. This allows creators to attach their custom features to a biome, and to define the rules by which those features are placed.

See: Introduction to Features .

- aggregate_feature

- cave_carver_feature

- fossil_feature

- geode_feature

- growing_plant_feature

- multiface_feature

- nether_cave_carver_feature

- ore_feature

- partially_exposed_blob_feature

- scatter_feature

- search_feature

- sequence_feature

- single_block_feature

- snap_to_surface_feature

- structure_template_feature

- surface_relative_threshold_feature

- tree_feature

- underwater_cave_carver_feature

- vegetation_patch_feature

- weighted_random_feature

## Holiday Creator Features

Several Item Components have released and are now available without using the Holiday Creator Features experiment toggle.

- wearable

- digger

- food

- damage

- use_animation

- use_modifiers

- allow_off_hand

- should_despawn

- liquid_clipped

- hand_equipped

- glint (previously known as foil)

- stacked_by_data

- enchantable

## Creator API

Another set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.5.0 release:

- Projectile Hit Events ProjectileHitBlockAfterEvent

- ProjectileHitBlockAfterEventSignal

- ProjectileHitEntityAfterEvent

- ProjectileHitEntityAfterEventSignal

- BlockHitInformation

- EntityHitInformation

- Spawn Particles APIs Dimension spawnParticle

- MolangVariableMap setColorRBG

- setColorRBGA

- setSpeedAndDirection

- setVector3

- setFloat

- RGBA

- Entity Trigger Event API Entity triggerEvent

- Player Equipment API EquipmentSlot Mainhand

- Offhand

- Head

- Chest

- Legs

- Feet

- EntityEquipmentEquippableComponent setEquipment

- getEquipment

 APIs included in the @minecraft/server version 1.4.0 release:

- Scoreboard Management Create/Read/Update/Delete Scoreboard

- ScoreboardObjective

- ScoreboardObjectiveDisplayOptions

- ScoreboardScoreInfo

- World scoreboard

- Entity scoreboardIdentity

- Reading/updating scores for specific ScoreboardIdentitys ScoreboardIdentity

- ScoreboardIdentityType

- Time APIs World getTimeOfDay

- setTimeOfDay

- getDay

- getAbsoluteTime

- setAbsoluteTime

- TimeOfDay

- Entity Damage Events

- EntityHitBlockAfterEvent

- EntityHitBlockAfterEventSignal

- EntityHitEntityAfterEvent

- EntityHitEntityAfterEventSignal

- EntityHurtAfterEvent

- EntityHurtAfterEventSignal

- EntityDieAfterEvent

- EntityDieAfterEventSignal

- WorldAfterEvents entityHitBlock

- entityHitEntity

- entityHurt

- entityDie

- Lore ItemStack getLore

- setLore

- Item Use Events ItemUseBeforeEvent - Fires before an item is used

- ItemUseBeforeEventSignal

- ItemUseOnBeforeEvent - Fires before an item is used on a block

- ItemUseOnBeforeEventSignal

- ItemUseAfterEvent - Fires after an item is used

- ItemUseAfterEventSignal

- ItemUseOnAfterEvent - Fires after an item is used on a block

- ItemUseOnAfterEventSignal

- ItemStartUseOnAfterEvent - Fires when a new block is placed

- ItemStartUseOnAfterEventSignal

- ItemStopUseOnAfterEvent - Fires when the player stops placing blocks

- ItemStopUseOnAfterEventSignal

- ItemCompleteUseAfterEvent - Fires when an item activates (e.g. finished eating, crossbow drawn)

- ItemCompleteUseAfterEventSignal

- ItemReleaseUseAfterEvent - Fires when an item is released (e.g. cancel eating, release bow)

- ItemReleaseUseAfterEventSignal

- ItemStopUseAfterEvent - Fires when an item stops being used. This always fires after a ItemReleaseUseAfterEvent or ItemCompleteUseAfterEvent.

- ItemStopUseAfterEventSignal

- ItemStartUseAfterEvent - Fires when an item starts being used. This always fires first. (e.g. eating, drawing bow)

- ItemStartUseAfterEventSignal

- WorldBeforeEvents itemUse

- itemUseOn

- WorldAfterEvents itemUse

- itemUseOn

- itemCompleteUse

- itemReleaseUse

- itemStopUse

- itemStartUse

- Script-Command Bridge /scriptevent command

- ScriptEventCommandMessageAfterEvent

- ScriptEventCommandMessageAfterEventSignal

- ScriptEventSource

- SystemAfterEvents scriptEventReceive

- Spawn Point APIs World setDefaultSpawnLocation

- getDefaultSpawnLocation

- Player setSpawnPoint

- getSpawnPoint

- Entity health changed event EntityHealthChangedAfterEvent

- EntityHealthChangedAfterEventSignal

- WorldAfterEvents entityHealthChanged

- Raycasting APIs - Get Entities / Get Block Dimension getEntitiesFromRay

- getBlockFromRay

- Entity getEntitiesFromViewDirection

- getBlockFromViewDirection

- EntityRaycastHit

- EntityRaycastOptions

- BlockRaycastHit

- BlockRaycastOptions

- Screen Display API ScreenDisplay

- TitleDisplayOptions

- Player onScreenDisplay

- More Block Events PressurePlatePushAfterEvent

- PressurePlatePushAfterEventSignal

- PressurePlatePopAfterEvent

- PressurePlatePopAfterEventSignal

- TripWireTripAfterEvent

- TripWireTripAfterEventSignal

- TargetBlockHitAfterEvent

- TargetBlockHitAfterEventSignal

- Object isValid() methods, added to the following classes: Block

- Container

- Effect

- ScreenDisplay

- ScoreboardObjective

- Entity Player

- SimulatedPlayer

- ContainerSlot (class still in beta)

- Component EntityAttributeComponent

- BlockLiquidContainerComponent (class still in beta)

- ECSScriptActorComponent (class still in beta)

- EntityComponent

- ItemComponent

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.6.0-beta. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## What's Next

Looking ahead, here's what you can expect coming in future releases.

 Camel and Sniffer Components

When the Camel and Sniffer were introduced in 1.20 they utilized a few components that weren't available to creators. These components will be released for creators to use in an upcoming release.

 Camera

Camera scripting APIs are currently experimental but will be moving to stable in an upcoming release.

 Creator API

Additional scripting APIs are planned to move to stable in an upcoming release:

- Camera

- Moon Phase

- Entity is* Properties

- Entity Rotation

- ItemStack

- More Block Events

- Set Weather

- Entity Lifetime Events

- Block isAir/isLiquid

- Entity Properties

- Player Experience/Level

- Player Dimension Changed Events

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
