> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.21.80?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:19.171Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.21.80 Update Notes for Creators

 Video version of this article from the Minecraft Creator Channel

Minecraft Bedrock has been updated to 1.21.80 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Editor

 Editor v0.9.5

- New user onboarding

- Updated selection

- Additional selection modes (trim and magic select)

- Error states

 Get started with Editor!

## Blocks

- Data-Driven biome tinting - Supports block textures per biome. minecraft:map_color tint_method

- minecraft:destruction_particles tint_method

- minecraft:material_instances tint_method

- Isotropic textures - Allows for random rotation of textures (e.g. vanilla dirt). minecraft:material_instances isotropic

- Destruction particle - Set a texture that appears when block is broken.

- Distance-Based Render Method Swap - Allows blocks to become visually opaque in the distance, instead of disappearing when their render method is not opaque (leaves). transparent block makes it to far layer switch texture to opaque. minecraft:material_instances "render_method": "blend_to_opaque"

- "render_method": "alpha_test_to_opaque"

- "render_method": "alpha_test_single_sided_to_opaque"

## Entities

Improvements have been made to rideables.

- The minecraft:rideable component now has three new additional fields: "dismount_mode" defines where riders are placed when dismounting the entity: "default", riders are placed on a valid ground position around the entity, or at the center of the entity's collision box if none is found

- "on_top_center", riders are placed at the center of the top of the entity's collision box

- "on_rider_enter_event", defines the event to execute on the owner entity when an entity starts riding it

- "on_rider_exit_event", defines the event to execute on the owner entity when an entity stops riding it

- The "minecraft:rideable" component's Seat definition now has two additional fields: "third_person_camera_radius" can be used to set a different camera radius when in third person or third person front camera.

- "camera_relax_distance_smoothing" adds springiness to the camera movement when the camera moves back to its radius after being pushed closer to the player by and obstacle.

Improvements have been made to leashes.

- The minecraft:leashable component now support multiple presets.

- query.leashed_entity_count - allows querying how many entities have the given entity as their leash holder.

- query.has_any_leashed_entity_of_type - checks if the entity has any of the listed entities leashed.

- has_equipment_tag - works like "has_equipment" but takes an item tag instead of an item name.

- Various tweaks have been made to navigation behaviors: minecraft:behavior.float_wander

- minecraft:behavior.follow_mob

- minecraft:behavior.tempt

- minecraft:behavior.float_tempt

## World Generation

- Pools, dimension padding, start height with vertical anchors - These parameters are added to the Jigsaw tech currently in experimental.

- /place feature - This allows for a feature to be placed at world gen via command or API.

## Platform

Graphics Mode Molang Queries

- query.graphics_mode_is_any

## Scripting API

- Block Bounding Box APIs BlockBoundingBox

- BLockBoundingUtils

- Place Feature APIs Dimension placeFeature

- placeFeatureRule

- Player Property APIs Player setPropertyOverrideForEntity

- removePropertyOverrideForEntity

- clearPropertyOverridesForEntity

- Game Difficulty APIs World getDifficulty

- setDifficulty

- Jigsaw Structure APIs StructureManager placeJigsaw

- placeJigsawStructure

- JigsawPlaceOptions

- JigsawStructionPlaceOptions

- PlaceJigsawError

## What's Next

Looking ahead, here's what you can expect coming in future releases.

### What's Next for World Gen

- Jigsaw Block - All of the functionality currently available in experimental is coming to stable in an upcoming releases.

- Improved Spawn rules - Allowing for customized mob spawning in biomes and structures.

### What's Next for Camera

- Over-the-shoulder style orbit preset

- Camera-relative player control schemes

## What's Next for Blocks

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
