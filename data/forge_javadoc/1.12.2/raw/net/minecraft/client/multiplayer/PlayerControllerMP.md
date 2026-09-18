---
title: "PlayerControllerMP"
description: "public class PlayerControllerMP extends java.lang.Object"
package: "net/minecraft/client/multiplayer"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/multiplayer/PlayerControllerMP.html"
sourceType: javadoc
---

# PlayerControllerMP

## Class signature

```java
public class PlayerControllerMP extends java.lang.Object
```

## Constructors

- `public PlayerControllerMP( Minecraft mcIn, NetHandlerPlayClient netHandler)`

## Methods

- `public static void clickBlockCreative( Minecraft mcIn, PlayerControllerMP playerController, BlockPos pos, EnumFacing facing)`
- `public void setPlayerCapabilities( EntityPlayer player)`
- `public boolean isSpectator()`
- `public void setGameType( GameType type)`
- `public void flipPlayer( EntityPlayer playerIn)`
- `public boolean shouldDrawHUD()`
- `public boolean onPlayerDestroyBlock( BlockPos pos)`
- `public boolean clickBlock( BlockPos loc, EnumFacing face)`
- `public void resetBlockRemoving()`
- `public boolean onPlayerDamageBlock( BlockPos posBlock, EnumFacing directionFacing)`
- `public float getBlockReachDistance()`
- `public void updateController()`
- `public EnumActionResult processRightClickBlock( EntityPlayerSP player, WorldClient worldIn, BlockPos pos, EnumFacing direction, Vec3d vec, EnumHand hand)`
- `public EnumActionResult processRightClick( EntityPlayer player, World worldIn, EnumHand hand)`
- `public EntityPlayerSP createPlayer( World p_192830_1_, StatisticsManager p_192830_2_, RecipeBook p_192830_3_)`
- `public void attackEntity( EntityPlayer playerIn, Entity targetEntity)`
- `public EnumActionResult interactWithEntity( EntityPlayer player, Entity target, EnumHand hand)`
- `public EnumActionResult interactWithEntity( EntityPlayer player, Entity target, RayTraceResult ray, EnumHand hand)`
- `public ItemStack windowClick(int windowId, int slotId, int mouseButton, ClickType type, EntityPlayer player)`
- `public void func_194338_a(int p_194338_1_, IRecipe p_194338_2_, boolean p_194338_3_, EntityPlayer p_194338_4_)`
- `public void sendEnchantPacket(int windowID, int button)`
- `public void sendSlotPacket( ItemStack itemStackIn, int slotId)`
- `public void sendPacketDropItem( ItemStack itemStackIn)`
- `public void onStoppedUsingItem( EntityPlayer playerIn)`
- `public boolean gameIsSurvivalOrAdventure()`
- `public boolean isNotCreative()`
- `public boolean isInCreativeMode()`
- `public boolean extendedReach()`
- `public boolean isRidingHorse()`
- `public boolean isSpectatorMode()`
- `public GameType getCurrentGameType()`
- `public boolean getIsHittingBlock()`
- `public void pickItem(int index)`
