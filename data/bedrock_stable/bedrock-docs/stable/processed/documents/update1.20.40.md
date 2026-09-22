> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.20.40?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:23.603Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.20.40 Update Notes for Creators

Minecraft Bedrock has been updated to 1.20.40 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Entities

When the Camel and Sniffer were included in 1.20 they had several "internal-only" components that were not usable by creators. These components are now releasing allowing for better customization of the Sniffer and Camel mobs.

- Camel Components dash

- Sniffer Components behavior.timer_flag_1

- behavior.timer_flag_2

- behavior.timer_flag_3

- behavior.random_search_and_dig

## Creator API

Another set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.6.0 release:

- Camera APIs Camera setCamera

- fade

- clear

- EasingType

- CameraSetRotOptions

- CameraSetFacingOptions

- CameraSetPosOptions

- CameraDefaultOptions

- CameraSetLocationOptions

- Moon Phase APIs World getMoonPhase

- MoonPhase

- MoonPhaseCount

- Entity "is" properties Player isEmoting

- isGliding

- isJumping

- isFlying

- Entity isSleeping

- isSneaking

- isSprinting

- isSwimming

- isClimbing

- isOnGround

- isInWater

- isFalling

- Entity Rotation APIs Entity getRotation

- setRotation

- ItemStack + its properties and methods ItemStack amount

- maxAmount

- isStackable

- isStackableWith

- keepOnDeath

- lockMode

- nameTag

- type

- typeId

- clone

- getComponent

- getComponents

- hasComponent

- getLore

- setLore

- getTags

- hasTag

- setCanDestroy

- setCanPlaceOn

- ItemLockMode

- ItemType

- ItemComponent

- More Block Events PlayerBreakBlockAfterEvent

- PlayerBreakBlockAfterEventSignal

- PlayerBreakBlockBeforeEvent

- PlayerBreakBlockBeforeEventSignal

- PlayerPlaceBlockAfterEvent

- PlayerPlaceBlockAfterEventSignal

- WorldAfterEvents playerBreakBlock

- playerPlaceBlock

- WorldBeforeEvents playerBreakBlock

- BlockEventOptions

- Set Weather API Dimension setWeather

- Entity Lifetime Events EntityRemoveAfterEvent

- EntityRemoveAfterEventSignal

- EntityRemoveBeforeEvent

- EntityRemoveBeforeEventSignal

- EntitySpawnAfterEvent

- EntitySpawnAfterEventSignal

- EntityInitializationCause

- EntityLoadAfterEvent

- EntityLoadAfterEventSignal

- WorldAfterEvents entityRemove

- entitySpawn

- entityLoad

- WorldBeforeEvents entityRemove

- Block isAir/isLiquid Block isAir

- isLiquid

- Entity Properties APIs Entity setProperty

- getProperty

- resetProperty

- Player Experience/Level Player addLevels

- addExperience

- level

- getTotalXP

- xpEarnedAtCurrentLevel

- totalXpNeededForNextLevel

- Player Dimension Changed Events PlayerDimensionChangeAfterEvent

- PlayerDimensionChangeAfterEventSignal

- DimensionType

- WorldAfterEvents playerDimensionChange

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.7.0-beta. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## What's Next

Looking ahead, here's what you can expect coming in future releases.

 Creator API

Additional scripting APIs are planned to move to stable in an upcoming release:

- Explosion Events

- World Dynamic Properties

- Entity Dynamic Properties

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
