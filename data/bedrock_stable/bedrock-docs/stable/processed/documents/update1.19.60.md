> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.19.60?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:25.774Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.19.60 Update Notes for Creators

Minecraft Bedrock has been updated to 1.19.60 and there are a number of changes of note for creators.

## Holiday Creator Features

We continue to work on bringing the Holiday Creator Features out of experimental. Our current focus is on block components. The following block components are now available outside of the experimental toggle in 1.19.60.

- PlacementFilter

- SelectionBox

- DisplayName

## Particle Effects

- Added support for mixed color blending on particle effects .

## Molang

- Added new Molang is_local_player to allow detection of the current player.

## Components

Some existing entity components have new capability that may be helpful to creators.

- Minecraft:shooter component – expanded to define multiple projectiles that can specify different projectile definitions and condition filters. Exposed more fields to shooter component to allow for more projectile customization such as throw power, sounds, and whether the attack is a magic attack.

- has_equipment filter - Added "inventory" as a possible "domain" value which allows to check for items stored in the entities' inventory.

- interact component - Added an "equip_item_slot" field. If set, an item held by the player will be equipped to the specified slot upon successful interaction.

- If an item is already present in the specified slot, it will be moved to the player's inventory

- Equipping an item removes it from the player's inventory, unless the player is in Creative Mode.

## Documentation

We've added additional reference documentation on commands. Check it out!

## Creator API

A reminder that a limited number of APIs were released out of experimental in 1.19.50 . There are no new APIs leaving experimental in 1.19.60 but there are a number of new APIs behind experimental.

The following APIs have been added to the Beta API experiment. To use these, you need to enable the Beta APIs experimental toggle.

 Updated scoreboard APIs allow for score read/write

- Scoreboard [setScore](../PriorScriptAPI/minecraft/server-1xx/Sc oreboard.md#setscore)(ScoreboardObjective, ScoreboardIdentity, Number)

- getScore (ScoreboardObjective, ScoreboardIdentity)

- ScoreboardObjective setScore (ScoreboardIdentity, Number)

- getScore (ScoreboardIdentity)

- removeParticipant (ScoreboardIdentity)

- ScoreboardIdentity setScore (ScoreboardObjective, Number)

- getScore (ScoreboardObjective)

- removeFromObjective (ScoreboardObjective)

 EntityHurt event

- Added read-only property damageSource: EntityDamageSource - Gets information about the damage source.

- EntityDamageSource Added property cause : EntityDamageCause - Gets the damage cause

- Added property damagingEntity ?: Entity - Gets the damaging Entity

- Added property damagingProjectile ?: Entity - Gets the damaging projectile Entity

- Added function applyDamage (amount: number, source?: EntityDamageSource): boolean - Applies damage to the Entity and returns the result of the operation

 Fill Blocks APIs

- Added function dimension.fillBlocks (begin: BlockLocation, end: BlockLocation, block: BlockPermutation | BlockType, options?: BlockFillOptions): number Fills an area between begin and end with block of type block. Returns number of blocks placed

- Added new interface BlockFillOptions with member matchingBlock?: BlockPermutation | BlockType Used with fillBlocks to apply additional options, such as only filling blocks matching matchingBlock

 Experience/Level APIs on Player

Additional functions and properties added to the Player Class to manage experience and levels.

- Added function addLevels (amount: number): number - Adds/Removes level to/from the Player and returns the current level of the Player

- Added function addExperience (amount: number): number - Adds/Removes experience to/from the Player and returns the current experience of the Player

- Added function resetLevel (): void - Resets the level of the Player

- Added function getTotalXp (): number - Gets the total experience of the Player

- Added read-only property level - Gets the level of the Player

- Added read-only property xpEarnedAtCurrentLevel - Gets the experience earned at the current level of the Player

- Added read-only property totalXpNeededForNextLevel - Gets the total experience required for the current level of the Player

 Effects and fire improvements

Additional APIs added to Entity Class to manage effects and fire status.

- Added method getEffects which returns an array of all active effects on the entity

- Added method setOnFire (seconds: number, useEffects?: boolean = true): boolean) which sets an entity on fire (if it is not in water or rain).

- Added method extinguishFire (useEffects?: boolean = true): void which extinguishes the fire.

 Send messages to JavaScript from commands with the /scriptevent command

- Added /scriptevent command as part of the Beta APIs experiment. This is what will trigger system.events.scriptEventReceive events (see below) Usage: /scriptevent [message: ???]

- messageId must be namespaced, use of the minecraft namespace is invalid (e.g. "/scriptevent give:coal", "/scriptevent my_scripts:spawn_sheep")

- message is optional, with a max length of 256 characters

- events.scriptEventReceive Added system event events.scriptEventReceive

- Added read-only property id: String- The namespaced ID of the event

- Added read-only property message: String- The content of the message the event was sent with

- Added read-only property sourceBlock: Block- The command block that triggered/executed the command call if applicable, otherwise undefined

- Added read-only property sourceEntity: Entity- The player/entity that executed the command call if applicable, otherwise undefined

- Added read-only property initiator: Entity- The player that caused an NPC to execute the command call if applicable, otherwise undefined

- Added read-only property sourceType: MessageSourceType- The type of source the event was triggered by

- subscribe()can filter by valid namespace string using the ScriptEventMessageFilterOptions class

- ScriptEventMessageFilterOptions Added ScriptEventMessageFilterOptions class

- Added property namespaces: string[]- An array of namespaces to filter on

 Other miscellaneous improvements:

- Block Added function getRedstonePower() : number - Gets the Redstone signal strength of the Block if it is part of a circuit, otherwise returns undefined.

- Simulated Player Added property isSprinting - Used to get or set if the sprinting state of the simulated player is set to true.

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.1.0-beta. Read more about script versioning .

Looking ahead to upcoming releases, we are looking to release our next set of APIs out of experimental, potentially including read-only block and entity APIs.

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
