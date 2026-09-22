> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.20.60?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:22.598Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.20.60 Update Notes for Creators

Minecraft Bedrock has been updated to 1.20.60 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Blocks

- Data-driven culling - Allows setting of culling rules to improve custom block performance and provide more control over per face rendering.

- Full Cube - minecraft:geometry.full_cube is a new block geometry identifier that provides the best performance when using a 1x1x1 block.

## Entities

- queue_command - An Entity event that allows for triggering of commands.

## Molang

The following queries were behind the long-running "Molang Features" experiment. They are releasing out of experimental in this release.

- Block Tags Queries query.relative_block_has_any_tag

- query.relative_block_has_all_tags

- query.block_neighbor_has_any_tag

- query.block_neighbor_has_all_tags

- query.block_has_any_tag

- query.block_has_all_tags

- Bone Orientation query.bone_orientation_matrix

- query.bone_orientation_trs

- Item Cooldown query.is_cooldown_type

- query.cooldown_time

- query.cooldown_time_remaining

## Creator API

Another set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.8.0 release:

- Explosion Events ExplosionAfterEvent

- ExplosionAfterEventSignal

- ExplosionBeforeEvent

- ExplosionBeforeEventSignal

- Effect Add Events EffectAddAfterEvent

- EffectAddAfterEventSignal

- EffectAddBeforeEvent

- EffectAddBeforeEventSignal

- DataDrivenEntityTriggerAfterEvent DataDrivenEntityTriggerAfterEvent

- DataDrivenEntityTriggerAfterEventSignal

- EntityDataDrivenTriggerEventOptions

- DefinitionModifier

- WorldAfterEvents dataDrivenEntityTrigger

- Block State APIs BlockPermutation withState

- getState

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.9.0-beta. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## What's Next

Looking ahead, here's what you can expect coming in future releases.

 Commands

- HUD Command - allows hiding of various HUD elements. This command is currently in experimental and will be stable in an upcoming release.

 Molang

- Ride/rider rotation queries

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
