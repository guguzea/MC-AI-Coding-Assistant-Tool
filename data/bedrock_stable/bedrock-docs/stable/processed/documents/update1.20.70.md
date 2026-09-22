> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.20.70?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:22.251Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.20.70 Update Notes for Creators

Minecraft Bedrock has been updated to 1.20.70 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Entities

- Target Selectors for Entity Properties - The capability of Entity Property has been extended with the ability to use Target Selectors .

## Items

- Custom Armor supports Armor Trims: Following the addition of Armor Trims in 1.20, we are shipping the ability for custom armor to work with armor trims.

## Molang

- Scoreboard query.scoreboard - This query is releasing out of experimental. It will be limited to server-side queries only.

- Ride/Rider Queries query.rider_body_x_rotation

- query.rider_body_y_rotation

- query.rider_head_x_rotation

- query.rider_head_y_rotation

- query.ride_body_x_rotation

- query.ride_body_y_rotation

- query.ride_head_x_rotation

- query.ride_head_y_rotation

- query.is_attached

- query.has_player_rider

With the release of these queries, the Experimental Molang toggle has been removed. Thank you to everyone that provided feedback through this long experimental period.

## Creator API

Another set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.9.0 release:

- Block type and state Manipulation BlockPermutation matches

- getAllStates

- Item Components ItemFoodComponent

- ItemDurabilityComponent

- ItemStack dynamic properties ItemStack clearDynamicProperties

- getDynamicProperty

- getDynamicPropertyIds

- getDynamicPropertyTotalByteCount

- setDynamicProperty

- Sign APIs BlockSignComponent

- Blow Things Up! Dimension createExplosion

- Entity setOnFire

- Projectiles and Particles player

- Effect Type Discovery EffectType

- EffectTypes

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.10.0-beta. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## What's Next

Looking ahead, here's what you can expect coming in future releases.

 Camera

- Improvements to entity rendering.

 Commands

- HUD Command - allows hiding of various HUD elements. This command is currently in experimental and will be stable in an upcoming release.

 Script API

- Structure APIs

- Player Interact Events

- Custom Components - allows extending Blocks and Items with the power of scripting. This is currently in experimental with many more APIs to come. It will continue to iterate for a bit before moving to stable.

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
