---
title: "ForgeHooks"
description: "Default implementation of IRecipe.func_179532_b {getRemainingItems} because this is just copy pasted over a lot of recipes."
package: "net/minecraftforge/common"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/ForgeHooks.html"
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

- `public static ItemStack getGrassSeed(java.util.Random rand, int fortune)`
- `public static boolean canHarvestBlock( Block block, EntityPlayer player, IBlockAccess world, BlockPos pos)`
- `public static boolean canToolHarvestBlock( IBlockAccess world, BlockPos pos, ItemStack stack)`
- `public static float blockStrength( IBlockState state, EntityPlayer player, World world, BlockPos pos)`
- `public static boolean isToolEffective( IBlockAccess world, BlockPos pos, ItemStack stack)`
- `public static int getTotalArmorValue( EntityPlayer player)`
- `public static boolean onPickBlock( RayTraceResult target, EntityPlayer player, World world)`
- `public static void onLivingSetAttackTarget( EntityLivingBase entity, EntityLivingBase target)`
- `public static boolean onLivingUpdate( EntityLivingBase entity)`
- `public static boolean onLivingAttack( EntityLivingBase entity, DamageSource src, float amount)`
- `public static float onLivingHurt( EntityLivingBase entity, DamageSource src, float amount)`
- `public static boolean onLivingDeath( EntityLivingBase entity, DamageSource src)`
- `public static boolean onLivingDrops( EntityLivingBase entity, DamageSource source, java.util.ArrayList< EntityItem > drops, int lootingLevel, boolean recentlyHit)`
- `public static float[] onLivingFall( EntityLivingBase entity, float distance, float damageMultiplier)`
- `public static int getLootingLevel( Entity target, Entity killer, DamageSource cause)`
- `public static int getLootingLevel( EntityLivingBase target, DamageSource cause, int level)`
- `public static double getPlayerVisibilityDistance( EntityPlayer player, double xzDistance, double maxXZDistance)`
- `public static boolean isLivingOnLadder( IBlockState state, World world, BlockPos pos, EntityLivingBase entity)`
- `public static void onLivingJump( EntityLivingBase entity)`
- `public static EntityItem onPlayerTossEvent( EntityPlayer player, ItemStack item, boolean includeName)`
- `public static float getEnchantPower( World world, BlockPos pos)`
- `public static ITextComponent onServerChatEvent( NetHandlerPlayServer net, java.lang.String raw, ITextComponent comp)`
- `public static ITextComponent newChatWithLinks(java.lang.String string)`
- `public static ITextComponent newChatWithLinks(java.lang.String string, boolean allowMissingHeader)`
- `public static int onBlockBreakEvent( World world, GameType gameType, EntityPlayerMP entityPlayer, BlockPos pos)`
- `public static EnumActionResult onPlaceItemIntoWorld( ItemStack itemstack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, EnumHand hand)`
- `public static boolean onAnvilChange( ContainerRepair container, ItemStack left, ItemStack right, IInventory outputSlot, java.lang.String name, int baseCost)`
- `public static float onAnvilRepair( EntityPlayer player, ItemStack output, ItemStack left, ItemStack right)`
- `public static boolean onNoteChange( TileEntityNote te, byte old)`
- `public static ItemStack [] defaultRecipeGetRemainingItems( InventoryCrafting inv)`
- `public static void setCraftingPlayer( EntityPlayer player)`
- `public static EntityPlayer getCraftingPlayer()`
- `public static ItemStack getContainerItem( ItemStack stack)`
- `public static boolean isInsideOfMaterial( Material material, Entity entity, BlockPos pos)`
- `public static boolean onPlayerAttackTarget( EntityPlayer player, Entity target)`
- `public static boolean onTravelToDimension( Entity entity, int dimension)`
- `public static RayTraceResult rayTraceEyes( EntityLivingBase entity, double length)`
- `public static Vec3d rayTraceEyeHitVec( EntityLivingBase entity, double length)`
- `public static boolean onInteractEntityAt( EntityPlayer player, Entity entity, RayTraceResult ray, ItemStack stack, EnumHand hand)`
- `public static boolean onInteractEntityAt( EntityPlayer player, Entity entity, Vec3d vec3d, ItemStack stack, EnumHand hand)`
- `public static boolean onInteractEntity( EntityPlayer player, Entity entity, ItemStack item, EnumHand hand)`
- `public static boolean onItemRightClick( EntityPlayer player, EnumHand hand, ItemStack stack)`
- `public static PlayerInteractEvent.LeftClickBlock onLeftClickBlock( EntityPlayer player, BlockPos pos, EnumFacing face, Vec3d hitVec)`
- `public static PlayerInteractEvent.RightClickBlock onRightClickBlock( EntityPlayer player, EnumHand hand, ItemStack stack, BlockPos pos, EnumFacing face, Vec3d hitVec)`
- `public static void onEmptyClick( EntityPlayer player, EnumHand hand)`
- `public static void onEmptyLeftClick( EntityPlayer player, ItemStack stack)`
- `public static LootTable loadLootTable(com.google.gson.Gson gson, ResourceLocation name, java.lang.String data, boolean custom)`
- `public static java.lang.String readPoolName(com.google.gson.JsonObject json)`
- `public static java.lang.String readLootEntryName(com.google.gson.JsonObject json, java.lang.String type)`
- `public static LootEntry deserializeJsonLootEntry(java.lang.String type, com.google.gson.JsonObject json, int weight, int quality, LootCondition [] conditions)`
- `public static java.lang.String getLootEntryType( LootEntry entry)`
- `public static boolean onThrowableImpact( EntityThrowable throwable, RayTraceResult ray)`
- `public static boolean onCropsGrowPre( World worldIn, BlockPos pos, IBlockState state, boolean def)`
- `public static void onCropsGrowPost( World worldIn, BlockPos pos, IBlockState state, IBlockState blockState)`

## Description

Default implementation of IRecipe.func_179532_b {getRemainingItems} because this is just copy pasted over a lot of recipes.
