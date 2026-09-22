> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.20.50?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:22.890Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.20.50 Update Notes for Creators

Minecraft Bedrock has been updated to 1.20.50 and there are a number of changes of note for creators. The following features do not require experimental toggles.

## Debug Workflows

- Added a Clear button to the content log screen

## UI

- Show/Hide Recipe Messages: Creators can now enable/disable the Vanilla game recipe-unlocking toast messages in their content using:

`/gamerule showrecipemessages`

## Blocks

- Toggle Decorative Pot Breaking: With 1.20.50, Vanilla was updated to include improved decorated pots including the ability to break them with projectiles. As a creator, you can choose whether you want this gamerule or not using: /gamerule projectilescanbreakblocks

## Items

- use_modifiers - Previously called "chargeable" and part of the Holiday Creator Features experiment. This functionality has been moved under the "use_modifiers" component.

- tags - An item component that determines which tags are included on a given item.

## Creator API

Another set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.7.0 release:

- World getEntity World getEntity

- Player Leave Before Event PlayerLeaveBeforeEvent

- PlayerLeaveBeforeEventSignal

- WorldBeforeEvents playerLeave

- Dimension height limits Dimension heightRange

- (minecraft/common) NumberRange

- Entity matches Entity matches

- World and Entity dynamic properties World clearDynamicProperties

- getDynamicProperty

- getDynamicPropertyIds

- getDynamicPropertyTotalByteCount

- setDynamicProperty

- Entity clearDynamicProperties

- getDynamicProperties

- getDynamicPropertyIds

- getDynamicPropertyTotalByteCount

- setDynamicProperty

- Player interact events PlayerInteractWithBlockBeforeEvent

- PlayerInteractWithBlockBeforeEventSignal

- PlayerInteractWithEntityBeforeEvent

- PlayerInteractWithEntityBeforeEventSignal

- PlayerInteractWithBlockAfterEvent

- PlayerInteractWithBlockAfterEventSignal

- PlayerInteractWithEntityAfterEvent

- PlayerInteractWithEntityAfterEventSignal

- TicksPerSecond TicksPerSecond (constant value = 20)

- Entity.remove Entity remove ;

- Common block utilities Block above

- below

- north

- east

- south

- west

- offset

- center

- bottomCenter

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.8.0-beta. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## What's Next

Looking ahead, here's what you can expect coming in future releases.

 queue_command

- Previously called "run_command", this allows easier triggering of commands from Entity JSON.

 Scripting API

Additional scripting APIs are planned to move to stable in an upcoming release:

- Explosion Events

- Effect Add Events

- DataDrivenEntity Trigger After Event

For more information on what's next, follow our Beta/Preview Changelogs .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
