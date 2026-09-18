---
title: "ForgeHooks"
description: "Default implementation of IRecipe.getRemainingItems {getRemainingItems} because this is just copy pasted over a lot of recipes."
package: "net/minecraftforge/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/ForgeHooks.html"
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
- `public static boolean canContinueUsing( ItemStack from, ItemStack to)`
- `public static boolean canHarvestBlock( Block block, EntityPlayer player, IBlockAccess world, BlockPos pos)`
- `public static boolean canToolHarvestBlock( IBlockAccess world, BlockPos pos, ItemStack stack)`
- `public static float blockStrength( IBlockState state, EntityPlayer player, World world, BlockPos pos)`
- `public static boolean isToolEffective( IBlockAccess world, BlockPos pos, ItemStack stack)`
- `public static int getTotalArmorValue( EntityPlayer player)`
- `public static boolean onPickBlock( RayTraceResult target, EntityPlayer player, World world)`
- `public static void onDifficultyChange( EnumDifficulty difficulty, EnumDifficulty oldDifficulty)`
- `public static void onLivingSetAttackTarget( EntityLivingBase entity, EntityLivingBase target)`
- `public static boolean onLivingUpdate( EntityLivingBase entity)`
- `public static boolean onLivingAttack( EntityLivingBase entity, DamageSource src, float amount)`
- `public static boolean onPlayerAttack( EntityLivingBase entity, DamageSource src, float amount)`
- `public static LivingKnockBackEvent onLivingKnockBack( EntityLivingBase target, Entity attacker, float strength, double ratioX, double ratioZ)`
- `public static float onLivingHurt( EntityLivingBase entity, DamageSource src, float amount)`
- `public static float onLivingDamage( EntityLivingBase entity, DamageSource src, float amount)`
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
- `public static NonNullList < ItemStack > defaultRecipeGetRemainingItems( InventoryCrafting inv)`
- `public static void setCraftingPlayer( EntityPlayer player)`
- `public static EntityPlayer getCraftingPlayer()`
- `public static ItemStack getContainerItem( ItemStack stack)`
- `public static boolean isInsideOfMaterial( Material material, Entity entity, BlockPos pos)`
- `public static boolean onPlayerAttackTarget( EntityPlayer player, Entity target)`
- `public static boolean onTravelToDimension( Entity entity, int dimension)`
- `public static RayTraceResult rayTraceEyes( EntityLivingBase entity, double length)`
- `public static Vec3d rayTraceEyeHitVec( EntityLivingBase entity, double length)`
- `public static EnumActionResult onInteractEntityAt( EntityPlayer player, Entity entity, RayTraceResult ray, EnumHand hand)`
- `public static EnumActionResult onInteractEntityAt( EntityPlayer player, Entity entity, Vec3d vec3d, EnumHand hand)`
- `public static EnumActionResult onInteractEntity( EntityPlayer player, Entity entity, EnumHand hand)`
- `public static EnumActionResult onItemRightClick( EntityPlayer player, EnumHand hand)`
- `public static PlayerInteractEvent.LeftClickBlock onLeftClickBlock( EntityPlayer player, BlockPos pos, EnumFacing face, Vec3d hitVec)`
- `public static PlayerInteractEvent.RightClickBlock onRightClickBlock( EntityPlayer player, EnumHand hand, BlockPos pos, EnumFacing face, Vec3d hitVec)`
- `public static void onEmptyClick( EntityPlayer player, EnumHand hand)`
- `public static void onEmptyLeftClick( EntityPlayer player)`
- `public static LootTable loadLootTable(Gson gson, ResourceLocation name, java.lang.String data, boolean custom, LootTableManager lootTableManager)`
- `public static java.lang.String readPoolName(JsonObject json)`
- `public static java.lang.String readLootEntryName(JsonObject json, java.lang.String type)`
- `public static LootEntry deserializeJsonLootEntry(java.lang.String type, JsonObject json, int weight, int quality, LootCondition [] conditions)`
- `public static java.lang.String getLootEntryType( LootEntry entry)`
- `@Deprecated public static boolean onThrowableImpact( EntityThrowable throwable, RayTraceResult ray)`
- `public static boolean onCropsGrowPre( World worldIn, BlockPos pos, IBlockState state, boolean def)`
- `public static void onCropsGrowPost( World worldIn, BlockPos pos, IBlockState state, IBlockState blockState)`
- `public static java.lang.String getRegistryName(java.lang.Class<? extends TileEntity > type)`
- `public static boolean loadAdvancements(java.util.Map< ResourceLocation , Advancement.Builder > map)`
- `public static CriticalHitEvent getCriticalHit( EntityPlayer player, Entity target, boolean vanillaCritical, float damageModifier)`
- `public static void sendRecipeBook( NetHandlerPlayServer connection, SPacketRecipeBook.State state, java.util.List< IRecipe > recipes, java.util.List< IRecipe > display, boolean isGuiOpen, boolean isFilteringCraftable)`
- `public static void onAdvancement( EntityPlayerMP player, Advancement advancement)`
- `public static java.lang.String getDefaultCreatorModId( ItemStack itemStack)`
- `public static boolean onFarmlandTrample( World world, BlockPos pos, IBlockState state, float fallDistance, Entity entity)`
- `public static DataSerializer <?> getSerializer(int id, IntIdentityHashBiMap < DataSerializer <?>> vanilla)`
- `public static int getSerializerId( DataSerializer <?> serializer, IntIdentityHashBiMap < DataSerializer <?>> vanilla)`

## Description

Default implementation of IRecipe.getRemainingItems {getRemainingItems} because this is just copy pasted over a lot of recipes.
