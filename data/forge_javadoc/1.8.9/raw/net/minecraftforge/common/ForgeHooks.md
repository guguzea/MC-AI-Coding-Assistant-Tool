---
title: "ForgeHooks"
description: "public class ForgeHooks extends java.lang.Object"
package: "net/minecraftforge/common"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/ForgeHooks.html"
sourceType: javadoc
---

# ForgeHooks

**Inheritance:** java.lang.Object → net.minecraftforge.common.ForgeHooks

## Class signature

```java
public class ForgeHooks extends java.lang.Object
```

## Constructors

- `ForgeHooks()`

## Methods

- `static float blockStrength(IBlockState state, EntityPlayer player, World world, BlockPos pos)`
- `static boolean canHarvestBlock(Block block, EntityPlayer player, IBlockAccess world, BlockPos pos)`
- `static boolean canInteractWith(EntityPlayer player, Container openContainer)`
- `static boolean canToolHarvestBlock(IBlockAccess world, BlockPos pos, ItemStack stack)`
- `static ItemStack [] defaultRecipeGetRemainingItems(InventoryCrafting inv)` — Default implementation of IRecipe.getRemainingItems {getRemainingItems} because this is just copy pasted over a lot of recipes.
- `static WorldGeneratorBonusChest getBonusChest(java.util.Random rand)`
- `static ItemStack getContainerItem(ItemStack stack)`
- `static EntityPlayer getCraftingPlayer()`
- `static float getEnchantPower(World world, BlockPos pos)`
- `static ItemStack getGrassSeed(java.util.Random rand)`
- `static int getTotalArmorValue(EntityPlayer player)`
- `static boolean isInsideOfMaterial(Material material, Entity entity, BlockPos pos)`
- `static boolean isLivingOnLadder(Block block, World world, BlockPos pos, EntityLivingBase entity)`
- `static boolean isToolEffective(IBlockAccess world, BlockPos pos, ItemStack stack)`
- `static IChatComponent newChatWithLinks(java.lang.String string)`
- `static IChatComponent newChatWithLinks(java.lang.String string, boolean allowMissingHeader)`
- `static boolean onAnvilChange(ContainerRepair container, ItemStack left, ItemStack right, IInventory outputSlot, java.lang.String name, int baseCost)`
- `static float onAnvilRepair(EntityPlayer player, ItemStack output, ItemStack left, ItemStack right)`
- `static int onBlockBreakEvent(World world, WorldSettings.GameType gameType, EntityPlayerMP entityPlayer, BlockPos pos)`
- `static boolean onLivingAttack(EntityLivingBase entity, DamageSource src, float amount)`
- `static boolean onLivingDeath(EntityLivingBase entity, DamageSource src)`
- `static boolean onLivingDrops(EntityLivingBase entity, DamageSource source, java.util.ArrayList<EntityItem> drops, int lootingLevel, boolean recentlyHit)`
- `static float[] onLivingFall(EntityLivingBase entity, float distance, float damageMultiplier)`
- `static float onLivingHurt(EntityLivingBase entity, DamageSource src, float amount)`
- `static void onLivingJump(EntityLivingBase entity)`
- `static void onLivingSetAttackTarget(EntityLivingBase entity, EntityLivingBase target)`
- `static boolean onLivingUpdate(EntityLivingBase entity)`
- `static boolean onNoteChange(TileEntityNote te, byte old)`
- `static boolean onPickBlock(MovingObjectPosition target, EntityPlayer player, World world)` — Called when a player uses 'pick block', calls new Entity and Block hooks.
- `static boolean onPlaceItemIntoWorld(ItemStack itemstack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `static boolean onPlayerAttackTarget(EntityPlayer player, Entity target)`
- `static EntityItem onPlayerTossEvent(EntityPlayer player, ItemStack item, boolean includeName)`
- `static ChatComponentTranslation onServerChatEvent(NetHandlerPlayServer net, java.lang.String raw, ChatComponentTranslation comp)`
- `static boolean onTravelToDimension(Entity entity, int dimension)`
- `static Vec3 rayTraceEyeHitVec(EntityLivingBase entity, double length)`
- `static MovingObjectPosition rayTraceEyes(EntityLivingBase entity, double length)`
- `static void setCraftingPlayer(EntityPlayer player)`
