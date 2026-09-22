> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.21?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:21.595Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.21 Update Notes for Creators

Minecraft Bedrock has been updated to 1.21 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Blocks

- Transform pivot point - We added an additional pivot point attribute to the block transformation component to facilitate rotation and scale operations. More information is available in the minecraft:transformation reference documentation.

- UV Rotations - This allows you to rotate the specified uv rect in 90 degree increments before applying it to a block face.

## Creator API

Another set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.11.0 release:

- HUD Show/Hide APIs ScreenDisplay getHiddenHudElements

- isForcedHidden

- resetHudElements

- setHudVisibility

- hideAllExcept

- HudElement

- HudVisibility

- Weather Before Event WeatherChangeBeforeEvent

- Enchantment APIs ItemEnchantableComponent

- Enchantment

- EnchantmentSlot

- EnchantmentType

- EnchantmentTypes

- EntityQueryOptions EntityQueryOptions volume

- Block TypeId Block setType

- type

- typeId

- matches

- BlockType id

- BlockTypes get

- getAll

- Game Rules APIs GameRules

- GameRule

- GameRuleChangeAfterEvent

- GameRuleChangeAfterEventSignal

- World gameRules

- WorldAfterEvents gameRuleChange

- Gamemode APIs Player setGameMode

- getGameMode

- PlayerGameModeChangeBeforeEvent

- PlayerGameModeChangeAfterEvent

- PlayerGameModeChangeBeforeEventSignal

- PlayerGameModeChangeAfterEventSignal

- WorldAfterEvents playerGameModeChange

- WorldBeforeEvents playerGameModeChange

- Block Volume APIs ListBlockVolume

- BlockVolumeBase

- BlockLocationIterator

- Color Component APIs EntityColorComponent

- EntityColor2Component

- PaletteColor

- EntityNavigation APIs EntityNavigationClimbComponent

- EntityNavigationComponent

- EntityNavigationFloatComponent

- EntityNavigationFlyComponent

- EntityNavigationGenericComponent

- EntityNavigationHoverComponent

- EntityNavigationWalkComponent

- Structure APIs Structure setBlockPermutation

- saveToWorld

- saveAs

- StructureManager createFromWorld

- getWorldStructureIds

- EntityComponent APIs EntityComponent entity

- Item Cooldown APIs Player startItemCooldown

- getItemCooldown

- Sound APIs Dimension playSound

- Selected Slot (Inventory) APIs Player selectedSlotIndex

- Tameable / Mount APIs EntityTameMountComponent tame

- EntityAddRiderComponent entityType

- spawnEvent

- EntityRideableComponent crouchingSkipInteract

- interactText

- controllingSeat

- passengerMaxWidth

- pullInEntities

- riderCanInteract

- seatCount

- addRider

- ejectRider

- ejectRiders

- getFamilyTypes

- getRiders

- getSeats

- Seat lockRiderRotation

- maxRiderCount

- minRiderCount

- position

- seatRotation

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.12.0-beta. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## What's Next

Looking ahead, here's what you can expect coming in future releases.

 Script API

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
