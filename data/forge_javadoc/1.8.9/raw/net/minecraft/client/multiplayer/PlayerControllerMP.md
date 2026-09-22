---
title: "PlayerControllerMP"
description: "public class PlayerControllerMP extends java.lang.Object"
package: "net/minecraft/client/multiplayer"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/multiplayer/PlayerControllerMP.html"
sourceType: javadoc
---

# PlayerControllerMP

**Inheritance:** java.lang.Object → net.minecraft.client.multiplayer.PlayerControllerMP

## Class signature

```java
public class PlayerControllerMP extends java.lang.Object
```

## Constructors

- `PlayerControllerMP(Minecraft mcIn, NetHandlerPlayClient p_i45062_2_)`

## Methods

- `void attackEntity(EntityPlayer playerIn, Entity targetEntity)` — Attacks an entity
- `boolean clickBlock(BlockPos loc, EnumFacing face)` — Called when the player is hitting a block with an item.
- `static void clickBlockCreative(Minecraft mcIn, PlayerControllerMP p_178891_1_, BlockPos p_178891_2_, EnumFacing p_178891_3_)`
- `boolean extendedReach()` — true for hitting entities far away.
- `void flipPlayer(EntityPlayer playerIn)` — Flips the player around.
- `EntityPlayerSP func_178892_a(World worldIn, StatFileWriter p_178892_2_)`
- `boolean func_178894_a(EntityPlayer p_178894_1_, Entity p_178894_2_, MovingObjectPosition p_178894_3_)`
- `boolean func_181040_m()`
- `boolean gameIsSurvivalOrAdventure()`
- `float getBlockReachDistance()` — player reach distance = 4F
- `WorldSettings.GameType getCurrentGameType()`
- `boolean interactWithEntitySendPacket(EntityPlayer playerIn, Entity targetEntity)` — Send packet to server - player is interacting with another entity (left click)
- `boolean isInCreativeMode()` — returns true if player is in creative mode
- `boolean isNotCreative()` — Checks if the player is not creative, used for checking if it should break a block instantly
- `boolean isRidingHorse()` — Checks if the player is riding a horse, used to chose the GUI to open
- `boolean isSpectator()` — None
- `boolean isSpectatorMode()`
- `boolean onPlayerDamageBlock(BlockPos posBlock, EnumFacing directionFacing)`
- `boolean onPlayerDestroyBlock(BlockPos pos, EnumFacing side)` — Called when a player completes the destruction of a block
- `boolean onPlayerRightClick(EntityPlayerSP player, WorldClient worldIn, ItemStack heldStack, BlockPos hitPos, EnumFacing side, Vec3 hitVec)`
- `void onStoppedUsingItem(EntityPlayer playerIn)`
- `void resetBlockRemoving()` — Resets current block damage and field_78778_j
- `void sendEnchantPacket(int p_78756_1_, int p_78756_2_)` — GuiEnchantment uses this during multiplayer to tell PlayerControllerMP to send a packet indicating the enchantment action the player has taken.
- `void sendPacketDropItem(ItemStack itemStackIn)` — Sends a Packet107 to the server to drop the item on the ground
- `void sendSlotPacket(ItemStack itemStackIn, int slotId)` — Used in PlayerControllerMP to update the server with an ItemStack in a slot.
- `boolean sendUseItem(EntityPlayer playerIn, World worldIn, ItemStack itemStackIn)` — Notifies the server of things like consuming food, etc...
- `void setGameType(WorldSettings.GameType p_78746_1_)` — Sets the game type for the player.
- `void setPlayerCapabilities(EntityPlayer p_78748_1_)` — Sets player capabilities depending on current gametype. params: player
- `boolean shouldDrawHUD()`
- `void updateController()`
- `ItemStack windowClick(int windowId, int slotId, int mouseButtonClicked, int mode, EntityPlayer playerIn)` — Handles slot clicks sends a packet to the server.
