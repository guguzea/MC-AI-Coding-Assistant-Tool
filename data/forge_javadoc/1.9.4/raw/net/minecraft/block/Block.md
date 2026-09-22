---
title: "Block"
description: "public class Block extends IForgeRegistryEntry.Impl<Block>"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/Block.html"
sourceType: javadoc
---

# Block

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block

## Class signature

```java
public class Block extends IForgeRegistryEntry.Impl<Block>
```

## Constructors

- `Block(Material materialIn)`
- `Block(Material blockMaterialIn, MapColor blockMapColorIn)`

## Methods

- `protected static void addCollisionBoxToList(BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, AxisAlignedBB blockBox)`
- `@Deprecated void addCollisionBoxToList(IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn)`
- `boolean addDestroyEffects(World world, BlockPos pos, ParticleManager manager)` — Spawn particles for when the block is destroyed.
- `boolean addHitEffects(IBlockState state, World worldObj, RayTraceResult target, ParticleManager manager)` — Spawn a digging particle effect in the world, this is a wrapper around EffectRenderer.addBlockHitEffects to allow the block more control over the particles.
- `void addInformation(ItemStack stack, EntityPlayer player, java.util.List<java.lang.String> tooltip, boolean advanced)` — Add information to the blocks tooltip, called from the default implementation of ItemBlock.addInformation(ItemStack, EntityPlayer, List, boolean)
- `boolean addLandingEffects(IBlockState state, WorldServer worldObj, BlockPos blockPosition, IBlockState iblockstate, EntityLivingBase entity, int numberOfParticles)` — Allows a block to override the standard EntityLivingBase.updateFallState particles, this is a server side method that spawns particles with WorldServer.spawnParticle
- `void beginLeavesDecay(IBlockState state, World world, BlockPos pos)` — Called when a leaf should start its decay process.
- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canBeReplacedByLeaves(IBlockState state, IBlockAccess world, BlockPos pos)` — Used during tree growth to determine if newly generated leaves can replace this block.
- `boolean canCollideCheck(IBlockState state, boolean hitIfLiquid)`
- `boolean canConnectRedstone(IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing side)` — Determine if this block can make a redstone connection on the side provided, Useful to control which sides are inputs and outputs for redstone wires.
- `boolean canCreatureSpawn(IBlockState state, IBlockAccess world, BlockPos pos, EntityLiving.SpawnPlacementType type)` — Determines if a specified mob type can spawn on this block, returning false will prevent any mob from spawning on the block.
- `boolean canDropFromExplosion(Explosion explosionIn)`
- `boolean canEntityDestroy(IBlockState state, IBlockAccess world, BlockPos pos, Entity entity)` — Determines if this block is can be destroyed by the specified entities normal behavior.
- `boolean canHarvestBlock(IBlockAccess world, BlockPos pos, EntityPlayer player)` — Determines if the player can harvest this block, obtaining it's drops when the block is destroyed.
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)`
- `boolean canPlaceTorchOnTop(IBlockState state, IBlockAccess world, BlockPos pos)` — Determines if a torch can be placed on the top surface of this block.
- `@Deprecated boolean canProvidePower(IBlockState state)`
- `@Deprecated boolean canRenderInLayer(BlockRenderLayer layer)` — Deprecated. New method with state sensitivity: canRenderInLayer(IBlockState, BlockRenderLayer)
- `boolean canRenderInLayer(IBlockState state, BlockRenderLayer layer)` — Queries if this block should render in a given layer.
- `boolean canReplace(World worldIn, BlockPos pos, EnumFacing side, ItemStack stack)`
- `@Deprecated protected boolean canSilkHarvest()`
- `boolean canSilkHarvest(World world, BlockPos pos, IBlockState state, EntityPlayer player)` — Return true from this function if the player with silk touch can harvest this block directly, and not it's normal drops.
- `boolean canSpawnInBlock()`
- `boolean canSustainLeaves(IBlockState state, IBlockAccess world, BlockPos pos)` — Determines if this block can prevent leaves connected to it from decaying.
- `boolean canSustainPlant(IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing direction, IPlantable plantable)` — Determines if this block can support the passed in plant, allowing it to be planted and grow.
- `protected java.util.List<ItemStack> captureDrops(boolean start)`
- `@Deprecated RayTraceResult collisionRayTrace(IBlockState blockState, World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `protected BlockStateContainer createBlockState()`
- `protected ItemStack createStackedBlock(IBlockState state)`
- `TileEntity createTileEntity(World world, IBlockState state)` — Called throughout the code as a replacement for ITileEntityProvider.createNewTileEntity Return the same thing you would from that function.
- `int damageDropped(IBlockState state)`
- `protected Block disableStats()`
- `boolean doesSideBlockRendering(IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing face)` — Check if the face of a block should block rendering.
- `void dropBlockAsItem(World worldIn, BlockPos pos, IBlockState state, int fortune)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `void dropXpOnBlockBreak(World worldIn, BlockPos pos, int amount)`
- `@Deprecated boolean eventReceived(IBlockState state, World worldIn, BlockPos pos, int id, int param)`
- `void fillWithRain(World worldIn, BlockPos pos)`
- `@Deprecated IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `@Deprecated float getAmbientOcclusionLightValue(IBlockState state)`
- `EnumFacing getBedDirection(IBlockState state, IBlockAccess world, BlockPos pos)` — Returns the direction of the block.
- `BlockPos getBedSpawnPosition(IBlockState state, IBlockAccess world, BlockPos pos, EntityPlayer player)` — Returns the position that the player is moved to upon waking up, or respawning at the bed.
- `static Block getBlockById(int id)`
- `static Block getBlockFromItem(Item itemIn)`
- `static Block getBlockFromName(java.lang.String name)`
- `@Deprecated float getBlockHardness(IBlockState blockState, World worldIn, BlockPos pos)`
- `BlockRenderLayer getBlockLayer()`
- `BlockStateContainer getBlockState()`
- `@Deprecated AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `@Deprecated AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, World worldIn, BlockPos pos)`
- `@Deprecated int getComparatorInputOverride(IBlockState blockState, World worldIn, BlockPos pos)`
- `CreativeTabs getCreativeTabToDisplayOn()`
- `IBlockState getDefaultState()`
- `java.util.List<ItemStack> getDrops(IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `boolean getEnableStats()`
- `float getEnchantPowerBonus(World world, BlockPos pos)` — Determines the amount of enchanting power this block can provide to an enchanting table.
- `int getExpDrop(IBlockState state, IBlockAccess world, BlockPos pos, int fortune)` — Gathers how much experience this block drops when broken.
- `float getExplosionResistance(Entity exploder)`
- `float getExplosionResistance(World world, BlockPos pos, Entity exploder, Explosion explosion)` — Location sensitive version of getExplosionRestance
- `IBlockState getExtendedState(IBlockState state, IBlockAccess world, BlockPos pos)` — Can return IExtendedBlockState
- `int getFireSpreadSpeed(IBlockAccess world, BlockPos pos, EnumFacing face)` — Called when fire is updating on a neighbor block.
- `int getFlammability(IBlockAccess world, BlockPos pos, EnumFacing face)` — Chance that fire will spread and consume this block. 300 being a 100% chance, 0, being a 0% chance.
- `int getHarvestLevel(IBlockState state)` — Queries the harvest level of this item stack for the specified tool class, Returns -1 if this tool is not of the specified type
- `java.lang.String getHarvestTool(IBlockState state)` — Queries the class of tool required to harvest this block, if null is returned we assume that anything can harvest this block.
- `static int getIdFromBlock(Block blockIn)`
- `@Deprecated ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `@Deprecated int getLightOpacity(IBlockState state)`
- `int getLightOpacity(IBlockState state, IBlockAccess world, BlockPos pos)` — Location aware and overrideable version of the lightOpacity array, return the number to subtract from the light value when it passes through this block.
- `@Deprecated int getLightValue(IBlockState state)`
- `int getLightValue(IBlockState state, IBlockAccess world, BlockPos pos)` — Get a light value for the block at the specified coordinates, normal ranges are between 0 and 15
- `java.lang.String getLocalizedName()`
- `@Deprecated MapColor getMapColor(IBlockState state)`
- `@Deprecated Material getMaterial(IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `@Deprecated EnumPushReaction getMobilityFlag(IBlockState state)`
- `Block.EnumOffsetType getOffsetType()`
- `@Deprecated int getPackedLightmapCoords(IBlockState state, IBlockAccess source, BlockPos pos)`
- `ItemStack getPickBlock(IBlockState state, RayTraceResult target, World world, BlockPos pos, EntityPlayer player)` — Called when a user uses the creative pick block button on this block
- `@Deprecated float getPlayerRelativeBlockHardness(IBlockState state, EntityPlayer player, World worldIn, BlockPos pos)`
- `@Deprecated EnumBlockRenderType getRenderType(IBlockState state)`
- `@Deprecated AxisAlignedBB getSelectedBoundingBox(IBlockState state, World worldIn, BlockPos pos)`
- `SoundType getSoundType()`
- `static IBlockState getStateById(int id)`
- `@Deprecated IBlockState getStateFromMeta(int meta)`
- `static int getStateId(IBlockState state)`
- `@Deprecated int getStrongPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)`
- `boolean getTickRandomly()`
- `java.lang.String getUnlocalizedName()`
- `@Deprecated boolean getUseNeighborBrightness(IBlockState state)`
- `EnumFacing [] getValidRotations(World world, BlockPos pos)` — Get the rotations that can apply to the block at the specified coordinates.
- `boolean getWeakChanges(IBlockAccess world, BlockPos pos)` — If this block should be notified of weak changes.
- `@Deprecated int getWeakPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `@Deprecated boolean hasComparatorInputOverride(IBlockState state)`
- `@Deprecated boolean hasTileEntity()`
- `boolean hasTileEntity(IBlockState state)` — Called throughout the code as a replacement for block instanceof BlockContainer Moving this to the Block base class allows for mods that wish to extend vanilla blocks, and also want to have a tile entity on that block, may.
- `java.lang.Boolean isAABBInsideMaterial(World world, BlockPos pos, AxisAlignedBB boundingBox, Material materialIn)` — Called when boats or fishing hooks are inside the block to check if they are inside the material requested.
- `boolean isAir(IBlockState state, IBlockAccess world, BlockPos pos)` — Determines this block should be treated as an air block by the rest of the code.
- `boolean isAssociatedBlock(Block other)`
- `boolean isBeaconBase(IBlockAccess worldObj, BlockPos pos, BlockPos beacon)` — Determines if this block can be used as the base of a beacon.
- `boolean isBed(IBlockState state, IBlockAccess world, BlockPos pos, Entity player)` — Determines if this block is classified as a Bed, Allowing players to sleep in it, though the block has to specifically perform the sleeping functionality in it's activated event.
- `boolean isBedFoot(IBlockAccess world, BlockPos pos)` — Determines if the current block is the foot half of the bed.
- `@Deprecated boolean isBlockNormalCube(IBlockState state)`
- `boolean isBlockSolid(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `boolean isBurning(IBlockAccess world, BlockPos pos)` — Determines if this block should set fire and deal fire damage to entities coming into contact with it.
- `boolean isCollidable()`
- `java.lang.Boolean isEntityInsideMaterial(IBlockAccess world, BlockPos blockpos, IBlockState iblockstate, Entity entity, double yToTest, Material materialIn, boolean testingHead)` — Called when the entity is inside this block, may be used to determined if the entity can breathing, display material overlays, or if the entity can swim inside a block.
- `static boolean isEqualTo(Block blockIn, Block other)`
- `boolean isFertile(World world, BlockPos pos)` — Checks if this soil is fertile, typically this means that growth rates of plants on this soil will be slightly sped up.
- `boolean isFireSource(World world, BlockPos pos, EnumFacing side)` — Currently only called by fire when it is on top of this block.
- `boolean isFlammable(IBlockAccess world, BlockPos pos, EnumFacing face)` — Called when fire is updating, checks if a block face can catch fire.
- `boolean isFoliage(IBlockAccess world, BlockPos pos)` — Used by getTopSolidOrLiquidBlock while placing biome decorations, villages, etc Also used to determine if the player can spawn on this block.
- `@Deprecated boolean isFullBlock(IBlockState state)`
- `@Deprecated boolean isFullCube(IBlockState state)`
- `@Deprecated boolean isFullyOpaque(IBlockState state)`
- `boolean isLadder(IBlockState state, IBlockAccess world, BlockPos pos, EntityLivingBase entity)` — Checks if a player or entity can use this block to 'climb' like a ladder.
- `boolean isLeaves(IBlockState state, IBlockAccess world, BlockPos pos)` — Determines if this block is considered a leaf block, used to apply the leaf decay and generation system.
- `@Deprecated boolean isNormalCube(IBlockState state)`
- `boolean isNormalCube(IBlockState state, IBlockAccess world, BlockPos pos)` — Return true if the block is a normal, solid cube.
- `@Deprecated boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `boolean isReplaceable(IBlockAccess worldIn, BlockPos pos)`
- `boolean isReplaceableOreGen(IBlockState state, IBlockAccess world, BlockPos pos, com.google.common.base.Predicate<IBlockState> target)` — Determines if the current block is replaceable by Ore veins during world generation.
- `boolean isSideSolid(IBlockState base_state, IBlockAccess world, BlockPos pos, EnumFacing side)` — Checks if the block is a solid face on the given side, used by placement logic.
- `boolean isToolEffective(java.lang.String type, IBlockState state)` — Checks if the specified tool type is efficient on this block, meaning that it digs at full speed.
- `@Deprecated boolean isTranslucent(IBlockState state)`
- `boolean isVisuallyOpaque()`
- `boolean isWood(IBlockAccess world, BlockPos pos)`
- `Vec3d modifyAcceleration(World worldIn, BlockPos pos, Entity entityIn, Vec3d motion)`
- `@Deprecated void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockClicked(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `void onBlockDestroyedByExplosion(World worldIn, BlockPos pos, Explosion explosionIn)`
- `void onBlockDestroyedByPlayer(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockExploded(World world, BlockPos pos, Explosion explosion)` — Called when the block is destroyed by an explosion.
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `void onEntityWalk(World worldIn, BlockPos pos, Entity entityIn)`
- `void onFallenUpon(World worldIn, BlockPos pos, Entity entityIn, float fallDistance)`
- `void onLanded(World worldIn, Entity entityIn)`
- `void onNeighborChange(IBlockAccess world, BlockPos pos, BlockPos neighbor)` — Called when a tile entity on a side of this block changes is created or is destroyed.
- `void onPlantGrow(IBlockState state, World world, BlockPos pos, BlockPos source)` — Called when a plant grows on this block, only implemented for saplings using the WorldGen*Trees classes right now.
- `int quantityDropped(IBlockState state, int fortune, java.util.Random random)` — State and fortune sensitive version, this replaces the old (int meta, Random rand) version in 1.1.
- `int quantityDropped(java.util.Random random)`
- `int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `protected RayTraceResult rayTrace(BlockPos pos, Vec3d start, Vec3d end, AxisAlignedBB boundingBox)`
- `boolean recolorBlock(World world, BlockPos pos, EnumFacing side, EnumDyeColor color)` — Common way to recolor a block with an external tool
- `static void registerBlocks()`
- `boolean removedByPlayer(IBlockState state, World world, BlockPos pos, EntityPlayer player, boolean willHarvest)` — Called when a player removes a block.
- `boolean requiresUpdates()`
- `boolean rotateBlock(World world, BlockPos pos, EnumFacing axis)` — Rotate the block.
- `void setBedOccupied(IBlockAccess world, BlockPos pos, EntityPlayer player, boolean occupied)` — Called when a user either starts or stops sleeping in the bed.
- `Block setBlockUnbreakable()`
- `Block setCreativeTab(CreativeTabs tab)`
- `protected void setDefaultState(IBlockState state)`
- `Block setHardness(float hardness)`
- `void setHarvestLevel(java.lang.String toolClass, int level)` — Sets or removes the tool and level required to harvest this block.
- `void setHarvestLevel(java.lang.String toolClass, int level, IBlockState state)` — Sets or removes the tool and level required to harvest this block.
- `Block setLightLevel(float value)`
- `Block setLightOpacity(int opacity)`
- `Block setResistance(float resistance)`
- `protected Block setSoundType(SoundType sound)`
- `Block setTickRandomly(boolean shouldTick)`
- `Block setUnlocalizedName(java.lang.String name)`
- `boolean shouldCheckWeakPower(IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing side)` — Called to determine whether to allow the a block to handle its own indirect power rather than using the default rules.
- `@Deprecated boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `static void spawnAsEntity(World worldIn, BlockPos pos, ItemStack stack)`
- `int tickRate(World worldIn)`
- `java.lang.String toString()`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `@Deprecated IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `@Deprecated IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static ObjectIntIdentityMap<IBlockState> BLOCK_STATE_IDS`
- `protected float blockHardness`
- `protected MapColor blockMapColor`
- `protected Material blockMaterial`
- `float blockParticleGravity`
- `protected float blockResistance`
- `protected SoundType blockSoundType`
- `protected BlockStateContainer blockState`
- `protected static java.lang.ThreadLocal<java.util.List<ItemStack>> capturedDrops`
- `protected static java.lang.ThreadLocal<java.lang.Boolean> captureDrops`
- `protected boolean enableStats`
- `static AxisAlignedBB FULL_BLOCK_AABB`
- `protected boolean fullBlock`
- `protected java.lang.ThreadLocal<EntityPlayer> harvesters`
- `protected boolean isBlockContainer`
- `protected int lightOpacity`
- `protected int lightValue`
- `protected boolean needsRandomTick`
- `static AxisAlignedBB NULL_AABB`
- `protected static java.util.Random RANDOM`
- `static RegistryNamespacedDefaultedByKey<ResourceLocation, Block> REGISTRY`
- `float slipperiness`
- `protected boolean translucent`
- `protected boolean useNeighborBrightness`
