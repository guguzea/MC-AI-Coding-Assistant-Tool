> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.20.10?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:24.709Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.20.10 Update Notes for Creators

Minecraft Bedrock has been updated to 1.20.10 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Holiday Creator Features

Several Item Components have released and are now available without using the Holiday Creator Features experiment toggle.

- cooldown

- repairable

- placer

- record

- shooter

- projectile

- throwable

- can_destroy_in_creative

- hover_text_color

- max_stack_size

Additionally, bone_visibility (part of the geometry Block component) has Molang capability added, restoring the functionality to be closer to the original experimental part_visibility component.

## Creator API

A fourth set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.3.0 release:

- Entity and Item spawning Dimension spawnEntity()

- spawnItem()

- Entity relocation/teleportation Entity teleport()

- tryTeleport()

- TeleportOptions

- Vector2

- Entity Effects create/read/update/delete Entity addEffect()

- getEffect()

- getEffects()

- removeEffect()

- Effect amplifier

- displayName

- duration

- typeId

- EffectType getName()

- EntityEffectOptions

- Entity Health components EntityAttributeComponent

- EntityHealthComponent

- EntityHealableComponent

- FeedItem

- FeedItemEffect

- Player join/spawn/leave events PlayerJoinAfterEvent

- PlayerJoinAfterEventSignal

- IPlayerJoinAfterEventSignal

- PlayerLeaveAfterEvent

- PlayerLeaveAfterEventSignal

- IPlayerLeaveAfterEventSignal

- PlayerSpawnAfterEvent

- PlayerSpawnAfterEventSignal

- IPlayerSpawnAfterEventSignal

- WorldAfterEvents playerJoin

- playerLeave

- playerSpawn

- Basic Block After Events (Button Push and Lever Action) ButtonPushAfterEvent

- ButtonPushAfterEventSignal

- IButtonPushAfterEventSignal

- LeverActionAfterEvent

- LeverActionAfterEventSignal

- ILeverActionAfterEventSignal

- WorldAfterEvents buttonPush

- leverAction

- Basic Block Component Model Block getComponent()

- BlockComponent

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.4.0-beta. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
