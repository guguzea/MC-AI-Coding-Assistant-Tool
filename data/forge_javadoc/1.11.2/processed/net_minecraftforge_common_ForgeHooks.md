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
- `static boolean canToolHarvestBlock(IBlockAccess world, BlockPos pos, ItemStack stack)`
- `static NonNullList<ItemStack> defaultRecipeGetRemainingItems(InventoryCrafting inv)` — Default implementation of IRecipe.func_179532_b {getRemainingItems} because this is just copy pasted over a lot of recipes.
- `static LootEntry deserializeJsonLootEntry(java.lang.String type, com.google.gson.JsonObject json, int weight, int quality, LootCondition [] conditions)`
- `static ItemStack getContainerItem(ItemStack stack)`
- `static EntityPlayer getCraftingPlayer()`
- `static float getEnchantPower(World world, BlockPos pos)`
- `static ItemStack getGrassSeed(java.util.Random rand, int fortune)`
- `static java.lang.String getLootEntryType(LootEntry entry)`
- `static int getLootingLevel(Entity target, Entity killer, DamageSource cause)`
- `static int getLootingLevel(EntityLivingBase target, DamageSource cause, int level)`
- `static double getPlayerVisibilityDistance(EntityPlayer player, double xzDistance, double maxXZDistance)`
- `static int getTotalArmorValue(EntityPlayer player)`
- `static boolean isInsideOfMaterial(Material material, Entity entity, BlockPos pos)`
- `static boolean isLivingOnLadder(IBlockState state, World world, BlockPos pos, EntityLivingBase entity)`
- `static boolean isToolEffective(IBlockAccess world, BlockPos pos, ItemStack stack)`
- `static LootTable loadLootTable(com.google.gson.Gson gson, ResourceLocation name, java.lang.String data, boolean custom)`
- `static ITextComponent newChatWithLinks(java.lang.String string)`
- `static ITextComponent newChatWithLinks(java.lang.String string, boolean allowMissingHeader)`
- `static boolean onAnvilChange(ContainerRepair container, ItemStack left, ItemStack right, IInventory outputSlot, java.lang.String name, int baseCost)`
- `static float onAnvilRepair(EntityPlayer player, ItemStack output, ItemStack left, ItemStack right)`
- `static int onBlockBreakEvent(World world, GameType gameType, EntityPlayerMP entityPlayer, BlockPos pos)`
- `static void onCropsGrowPost(World worldIn, BlockPos pos, IBlockState state, IBlockState blockState)`
- `static boolean onCropsGrowPre(World worldIn, BlockPos pos, IBlockState state, boolean def)`
- `static void onEmptyClick(EntityPlayer player, EnumHand hand)`
- `static void onEmptyLeftClick(EntityPlayer player)`
- `@Deprecated static void onEmptyLeftClick(EntityPlayer player, ItemStack stack)` — Deprecated. use onEmptyLeftClick(EntityPlayer)
- `static boolean onInteractEntity(EntityPlayer player, Entity entity, EnumHand hand)`
- `static boolean onInteractEntityAt(EntityPlayer player, Entity entity, RayTraceResult ray, EnumHand hand)`
- `static boolean onInteractEntityAt(EntityPlayer player, Entity entity, Vec3d vec3d, EnumHand hand)`
- `static boolean onItemRightClick(EntityPlayer player, EnumHand hand)`
- `static PlayerInteractEvent.LeftClickBlock onLeftClickBlock(EntityPlayer player, BlockPos pos, EnumFacing face, Vec3d hitVec)`
- `static boolean onLivingAttack(EntityLivingBase entity, DamageSource src, float amount)`
- `static boolean onLivingDeath(EntityLivingBase entity, DamageSource src)`
- `static boolean onLivingDrops(EntityLivingBase entity, DamageSource source, java.util.ArrayList<EntityItem> drops, int lootingLevel, boolean recentlyHit)`
- `static float[] onLivingFall(EntityLivingBase entity, float distance, float damageMultiplier)`
- `static float onLivingHurt(EntityLivingBase entity, DamageSource src, float amount)`
- `static void onLivingJump(EntityLivingBase entity)`
- `static void onLivingSetAttackTarget(EntityLivingBase entity, EntityLivingBase target)`
- `static boolean onLivingUpdate(EntityLivingBase entity)`
- `static boolean onNoteChange(TileEntityNote te, byte old)`
- `static boolean onPickBlock(RayTraceResult target, EntityPlayer player, World world)` — Called when a player uses 'pick block', calls new Entity and Block hooks.
- `static EnumActionResult onPlaceItemIntoWorld(ItemStack itemstack, EntityPlayer player, World world, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ, EnumHand hand)`
- `static boolean onPlayerAttackTarget(EntityPlayer player, Entity target)`
- `static EntityItem onPlayerTossEvent(EntityPlayer player, ItemStack item, boolean includeName)`
- `static PlayerInteractEvent.RightClickBlock onRightClickBlock(EntityPlayer player, EnumHand hand, BlockPos pos, EnumFacing face, Vec3d hitVec)`
- `static ITextComponent onServerChatEvent(NetHandlerPlayServer net, java.lang.String raw, ITextComponent comp)`
- `static boolean onThrowableImpact(EntityThrowable throwable, RayTraceResult ray)`
- `static boolean onTravelToDimension(Entity entity, int dimension)`
- `static Vec3d rayTraceEyeHitVec(EntityLivingBase entity, double length)`
- `static RayTraceResult rayTraceEyes(EntityLivingBase entity, double length)`
- `static java.lang.String readLootEntryName(com.google.gson.JsonObject json, java.lang.String type)`
- `static java.lang.String readPoolName(com.google.gson.JsonObject json)`
- `static void setCraftingPlayer(EntityPlayer player)`