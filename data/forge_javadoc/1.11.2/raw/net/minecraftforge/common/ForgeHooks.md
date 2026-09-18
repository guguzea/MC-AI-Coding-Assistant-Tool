---
title: "ForgeHooks"
description: "Default implementation of IRecipe.func_179532_b {getRemainingItems} because this is just copy pasted over a lot of recipes."
package: "net/minecraftforge/common"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/ForgeHooks.html"
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

- `@Nonnull public static ItemStack getGrassSeed(java.util.Random rand, int fortune)`
- `public static boolean canHarvestBlock(@Nonnull Block block, @Nonnull EntityPlayer player, @Nonnull IBlockAccess world, @Nonnull BlockPos pos)`
- `public static boolean canToolHarvestBlock( IBlockAccess world, BlockPos pos, @Nonnull ItemStack stack)`
- `public static float blockStrength(@Nonnull IBlockState state, @Nonnull EntityPlayer player, @Nonnull World world, @Nonnull BlockPos pos)`
- `public static boolean isToolEffective( IBlockAccess world, BlockPos pos, @Nonnull ItemStack stack)`
- `public static int getTotalArmorValue( EntityPlayer player)`
- `public static boolean onPickBlock( RayTraceResult target, EntityPlayer player, World world)`
- `public static void onLivingSetAttackTarget( EntityLivingBase entity, EntityLivingBase target)`
- `public static boolean onLivingUpdate( EntityLivingBase entity)`
- `public static boolean onLivingAttack( EntityLivingBase entity, DamageSource src, float amount)`
- `public static float onLivingHurt( EntityLivingBase entity, DamageSource src, float amount)`
- `public static boolean onLivingDeath( EntityLivingBase entity, DamageSource src)`
- `public static boolean onLivingDrops( EntityLivingBase entity, DamageSource source, java.util.ArrayList< EntityItem > drops, int lootingLevel, boolean recentlyHit)`
- `@Nullable public static float[] onLivingFall( EntityLivingBase entity, float distance, float damageMultiplier)`
- `public static int getLootingLevel( Entity target, @Nullable Entity killer, DamageSource cause)`
- `public static int getLootingLevel( EntityLivingBase target, DamageSource cause, int level)`
- `public static double getPlayerVisibilityDistance( EntityPlayer player, double xzDistance, double maxXZDistance)`
- `public static boolean isLivingOnLadder(@Nonnull IBlockState state, @Nonnull World world, @Nonnull BlockPos pos, @Nonnull EntityLivingBase entity)`
- `public static void onLivingJump( EntityLivingBase entity)`
- `@Nullable public static EntityItem onPlayerTossEvent(@Nonnull EntityPlayer player, @Nonnull ItemStack item, boolean includeName)`
- `public static float getEnchantPower(@Nonnull World world, @Nonnull BlockPos pos)`
- `@Nullable public static ITextComponent onServerChatEvent( NetHandlerPlayServer net, java.lang.String raw, ITextComponent comp)`
- `public static ITextComponent newChatWithLinks(java.lang.String string)`
- `public static ITextComponent newChatWithLinks(java.lang.String string, boolean allowMissingHeader)`
- `public static int onBlockBreakEvent( World world, GameType gameType, EntityPlayerMP entityPlayer, BlockPos pos)`
- `public static EnumActionResult onPlaceItemIntoWorld(@Nonnull ItemStack itemstack, @Nonnull EntityPlayer player, @Nonnull World world, @Nonnull BlockPos pos, @Nonnull EnumFacing side, float hitX, float hitY, float hitZ, @Nonnull EnumHand hand)`
- `public static boolean onAnvilChange( ContainerRepair container, @Nonnull ItemStack left, @Nonnull ItemStack right, IInventory outputSlot, java.lang.String name, int baseCost)`
- `public static float onAnvilRepair( EntityPlayer player, @Nonnull ItemStack output, @Nonnull ItemStack left, @Nonnull ItemStack right)`
- `public static boolean onNoteChange( TileEntityNote te, byte old)`
- `public static NonNullList < ItemStack > defaultRecipeGetRemainingItems( InventoryCrafting inv)`
- `public static void setCraftingPlayer( EntityPlayer player)`
- `public static EntityPlayer getCraftingPlayer()`
- `@Nonnull public static ItemStack getContainerItem(@Nonnull ItemStack stack)`
- `public static boolean isInsideOfMaterial( Material material, Entity entity, BlockPos pos)`
- `public static boolean onPlayerAttackTarget( EntityPlayer player, Entity target)`
- `public static boolean onTravelToDimension( Entity entity, int dimension)`
- `@Nullable public static RayTraceResult rayTraceEyes( EntityLivingBase entity, double length)`
- `@Nullable public static Vec3d rayTraceEyeHitVec( EntityLivingBase entity, double length)`
- `public static boolean onInteractEntityAt( EntityPlayer player, Entity entity, RayTraceResult ray, EnumHand hand)`
- `public static boolean onInteractEntityAt( EntityPlayer player, Entity entity, Vec3d vec3d, EnumHand hand)`
- `public static boolean onInteractEntity( EntityPlayer player, Entity entity, EnumHand hand)`
- `public static boolean onItemRightClick( EntityPlayer player, EnumHand hand)`
- `public static PlayerInteractEvent.LeftClickBlock onLeftClickBlock( EntityPlayer player, BlockPos pos, EnumFacing face, Vec3d hitVec)`
- `public static PlayerInteractEvent.RightClickBlock onRightClickBlock( EntityPlayer player, EnumHand hand, BlockPos pos, EnumFacing face, Vec3d hitVec)`
- `public static void onEmptyClick( EntityPlayer player, EnumHand hand)`
- `public static void onEmptyLeftClick( EntityPlayer player)`
- `@Deprecated public static void onEmptyLeftClick( EntityPlayer player, @Nonnull ItemStack stack)`
- `@Nullable public static LootTable loadLootTable(com.google.gson.Gson gson, ResourceLocation name, java.lang.String data, boolean custom)`
- `public static java.lang.String readPoolName(com.google.gson.JsonObject json)`
- `public static java.lang.String readLootEntryName(com.google.gson.JsonObject json, java.lang.String type)`
- `public static LootEntry deserializeJsonLootEntry(java.lang.String type, com.google.gson.JsonObject json, int weight, int quality, LootCondition [] conditions)`
- `public static java.lang.String getLootEntryType( LootEntry entry)`
- `public static boolean onThrowableImpact( EntityThrowable throwable, RayTraceResult ray)`
- `public static boolean onCropsGrowPre( World worldIn, BlockPos pos, IBlockState state, boolean def)`
- `public static void onCropsGrowPost( World worldIn, BlockPos pos, IBlockState state, IBlockState blockState)`

## Description

Default implementation of IRecipe.func_179532_b {getRemainingItems} because this is just copy pasted over a lot of recipes.
