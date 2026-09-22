> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.20?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:24.424Z
> 警告：此文档可能滞后于当前正式版

# Minecraft Bedrock 1.20 Update Notes for Creators

Minecraft Bedrock has been updated to 1.20 and there are a number of changes of note for creators.

## Holiday Creator Features

Five Item Components have released and are now available without using the Holiday Creator Features experiment toggle.

- display_name

- durability

- entity_placer

- fuel

- icon

## Creator API

A third set of Creator APIs have been released out of beta and into stable (see: script versioning for information on how we version Creator APIs ). These APIs should be a lot more stable and also allow Marketplace content creators to leverage them with backwards compatibility support.

 APIs included in the @minecraft/server version 1.2.0 release:

- Entity damage application (Entity) kill

- (Entity) applyDamage

- EntityApplyDamageOptions

- EntityApplyDamageByProjectileOptions

- EntityDamageCause

- Entity tagging addTag

- removeTag

- hasTag

- getTags

- Entity Components getComponent

- getComponents

- hasComponent

- Entity Inventory Container

- EntityInventoryComponent

- Block Inventory BlockInventoryComponent

- Music (World) playMusic

- (World) queueMusic

- (World) stopMusic

- MusicOptions

- Sound (Player) playSound

- (World) playSound

- PlayerSoundOptions

- WorldSoundOptions

- ItemStack (read-only APIs)

- ItemStack basic component model EntityItemComponent

- ItemComponent

- ItemType

- ItemLockMode

- Entity velocity APIs applyImpulse

- applyKnockback

- clearVelocity

- Execution Fundamentals runCommand

- runInterval

 APIs included in the @minecraft/server-ui version 1.0.0 release:

- Basic form server UI ModalFormData

- MessageFormData

- ActionFormData

Beta APIs will continue to be developed behind the Beta API experimental flag so if you want to use those, make sure you have that flag enabled and your manifest.json references will need to update to 1.3.0-beta. Read more about script versioning .

Scripting is a powerful way to add complex behavior to your experience. It allows for a professional development environment that includes profiling and hot reloading .

 Get started with scripting .

## New Experimental Features

 Camera

The camera feature allows for defining custom cameras via JSON, and manipulating them via the /camera command. This initial experiment focuses on the `free camera` preset.

 Block Traits

 Block Traits are intended as a shortcut for creators to add Vanilla BlockStates and setter functions to data-driven blocks.

For example:

- By using the minecraft:placement_direction trait to set the minecraft:cardinal_direction state, you can create a custom furnace block that will orient so the front is facing the player.

- By using the minecraft:placement_position trait to set the minecraft:block_face (the face the block was placed on) and minecraft:vertical_half (if a block was placed on the top or bottom) states, you can easily create blocks that behave like slabs or trapdoors.

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
