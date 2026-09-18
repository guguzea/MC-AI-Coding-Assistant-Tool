---
title: "ForgeHooks"
description: "Default implementation of IRecipe.getRemainingItems {getRemainingItems} because this is just copy pasted over a lot of recipes."
package: "net/minecraftforge/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/ForgeHooks.html"
sourceType: javadoc
---

# ForgeHooks

## Class signature

```java
public class ForgeHooks extends java.lang.Object
```

## Constructors

- `public ForgeHooks()`

## Methods

- `public static ItemStack getGrassSeed(java.util.Random rand)`
- `public static boolean canHarvestBlock( Block block, EntityPlayer player, IBlockAccess world, BlockPos pos)`
- `public static boolean canToolHarvestBlock( IBlockAccess world, BlockPos pos, ItemStack stack)`
- `public static float blockStrength( IBlockState state, EntityPlayer player, World world, BlockPos pos)`
- `public static boolean isToolEffective( IBlockAccess world, BlockPos pos, ItemStack stack)`
- `public static int getTotalArmorValue( EntityPlayer player)`
- `public static boolean onPickBlock( MovingObjectPosition target, EntityPlayer player, World world)`
- `public static void onLivingSetAttackTarget( EntityLivingBase entity, EntityLivingBase target)`
- `public static boolean onLivingUpdate( EntityLivingBase entity)`
- `public static boolean onLivingAttack( EntityLivingBase entity, DamageSource src, float amount)`
- `public static float onLivingHurt( EntityLivingBase entity, DamageSource src, float amount)`
- `public static boolean onLivingDeath( EntityLivingBase entity, DamageSource src)`
- `public static boolean onLivingDrops( EntityLivingBase entity, DamageSource source, java.util.ArrayList< EntityItem > drops, int lootingLevel, boolean recentlyHit)`
- `public static float[] onLivingFall( EntityLivingBase entity, float distance, float damageMultiplier)`
- `public static boolean isLivingOnLadder( Block block, World world, BlockPos pos, EntityLivingBase entity)`
- `public static void onLivingJump( EntityLivingBase entity)`
- `public static EntityItem onPlayerTossEvent( EntityPlayer player, ItemStack item, boolean includeName)`
- `public static float getEnchantPower( World world, BlockPos pos)`
- `public static ChatComponentTranslation onServerChatEvent( NetHandlerPlayServer net, java.lang.String raw, ChatComponentTranslation comp)`
- `public static IChatComponent newChatWithLinks(java.lang.String string)`
- `public static IChatComponent newChatWithLinks(java.lang.String string, boolean allowMissingHeader)`
- `public static boolean canInteractWith( EntityPlayer player, Container openContainer)`
- `public static int onBlockBreakEvent( World world, WorldSettings.GameType gameType, EntityPlayerMP entityPlayer, BlockPos pos)`
- `public static boolean onPlaceItemIntoWorld( ItemStack itemstack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public static boolean onAnvilChange( ContainerRepair container, ItemStack left, ItemStack right, IInventory outputSlot, java.lang.String name, int baseCost)`
- `public static float onAnvilRepair( EntityPlayer player, ItemStack output, ItemStack left, ItemStack right)`
- `public static boolean onNoteChange( TileEntityNote te, byte old)`
- `public static ItemStack [] defaultRecipeGetRemainingItems( InventoryCrafting inv)`
- `public static void setCraftingPlayer( EntityPlayer player)`
- `public static EntityPlayer getCraftingPlayer()`
- `public static ItemStack getContainerItem( ItemStack stack)`
- `public static WorldGeneratorBonusChest getBonusChest(java.util.Random rand)`
- `public static boolean isInsideOfMaterial( Material material, Entity entity, BlockPos pos)`
- `public static boolean onPlayerAttackTarget( EntityPlayer player, Entity target)`
- `public static boolean onTravelToDimension( Entity entity, int dimension)`
- `public static MovingObjectPosition rayTraceEyes( EntityLivingBase entity, double length)`
- `public static Vec3 rayTraceEyeHitVec( EntityLivingBase entity, double length)`

## Description

Default implementation of IRecipe.getRemainingItems {getRemainingItems} because this is just copy pasted over a lot of recipes.
