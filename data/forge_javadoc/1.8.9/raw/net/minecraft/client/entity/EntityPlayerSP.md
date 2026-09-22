---
title: "EntityPlayerSP"
description: "public class EntityPlayerSP extends AbstractClientPlayer"
package: "net/minecraft/client/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/entity/EntityPlayerSP.html"
sourceType: javadoc
---

# EntityPlayerSP

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.client.entity.AbstractClientPlayer → net.minecraft.client.entity.EntityPlayerSP

## Class signature

```java
public class EntityPlayerSP extends AbstractClientPlayer
```

## Constructors

- `EntityPlayerSP(Minecraft mcIn, World worldIn, NetHandlerPlayClient netHandler, StatFileWriter statFile)`

## Methods

- `void addChatComponentMessage(IChatComponent chatComponent)`
- `void addChatMessage(IChatComponent component)` — Send a chat message to the CommandSender
- `void addStat(StatBase stat, int amount)` — Adds a value to a statistic field.
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)` — Returns true if the CommandSender is allowed to execute the command, false if not
- `void closeScreen()` — set current crafting inventory back to the 2x2 square
- `void closeScreenAndDropStack()`
- `protected void damageEntity(DamageSource damageSrc, float damageAmount)` — Deals damage to the entity.
- `void displayGui(IInteractionObject guiOwner)`
- `void displayGUIBook(ItemStack bookStack)` — Displays the GUI for interacting with a book.
- `void displayGUIChest(IInventory chestInventory)` — Displays the GUI for interacting with a chest inventory.
- `void displayGUIHorse(EntityHorse horse, IInventory horseInventory)`
- `void displayVillagerTradeGui(IMerchant villager)`
- `EntityItem dropOneItem(boolean dropAll)` — Called when player presses the drop item key
- `java.lang.String getClientBrand()`
- `float getHorseJumpPower()`
- `BlockPos getPosition()` — Get the position in the world.
- `StatFileWriter getStatFileWriter()`
- `void heal(float healAmount)` — Heal living entity (param: amount of half-hearts)
- `protected boolean isCurrentViewEntity()`
- `boolean isRidingHorse()`
- `boolean isServerWorld()` — Returns whether the entity is in a server world
- `boolean isSneaking()` — Returns if this entity is sneaking.
- `boolean isUser()` — returns true if this is an EntityPlayerSP, or the logged in player.
- `void joinEntityItemWithWorld(EntityItem itemIn)` — Joins the passed in entity item with the world.
- `void mountEntity(Entity entityIn)` — Called when a player mounts an entity. e.g. mounts a pig, mounts a boat.
- `void onCriticalHit(Entity entityHit)` — Called when the player performs a critical hit on the Entity.
- `void onEnchantmentCritical(Entity entityHit)`
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void onUpdateWalkingPlayer()` — called every tick when the player is on foot.
- `void openEditCommandBlock(CommandBlockLogic cmdBlockLogic)`
- `void openEditSign(TileEntitySign signTile)`
- `void playSound(java.lang.String name, float volume, float pitch)`
- `protected boolean pushOutOfBlocks(double x, double y, double z)`
- `void respawnPlayer()`
- `void sendChatMessage(java.lang.String message)` — Sends a chat message from the player.
- `void sendHorseInventory()`
- `protected void sendHorseJump()`
- `void sendPlayerAbilities()` — Sends the player's abilities to the server (if there is one).
- `void setClientBrand(java.lang.String brand)`
- `void setPlayerSPHealth(float health)` — Updates health locally.
- `void setSprinting(boolean sprinting)` — Set sprinting switch for Entity.
- `void setXPStats(float currentXP, int maxXP, int level)` — Sets the current XP, total XP, and level number.
- `void swingItem()` — Swings the item the player is holding.
- `void updateEntityActionState()`

## Fields

- `protected Minecraft mc`
- `MovementInput movementInput`
- `float prevRenderArmPitch`
- `float prevRenderArmYaw`
- `float prevTimeInPortal` — The amount of time an entity has been in a Portal the previous tick
- `float renderArmPitch`
- `float renderArmYaw`
- `NetHandlerPlayClient sendQueue`
- `int sprintingTicksLeft` — Ticks left before sprinting is disabled.
- `protected int sprintToggleTimer` — Used to tell if the player pressed forward twice.
- `float timeInPortal` — The amount of time an entity has been in a Portal
