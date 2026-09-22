# TileEntity

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity

## Class signature

```java
public abstract class TileEntity extends java.lang.Object implements ICapabilitySerializable<NBTTagCompound>
```

## Constructors

- `TileEntity()`

## Methods

- `void addInfoToCrashReport(CrashReportCategory reportCategory)`
- `static void addMapping(java.lang.Class<? extends TileEntity> cl, java.lang.String id)`
- `boolean canRenderBreaking()` — Checks if this tile entity knows how to render its 'breaking' overlay effect.
- `static TileEntity create(NBTTagCompound compound)`
- `void deserializeNBT(NBTTagCompound nbt)`
- `int getBlockMetadata()`
- `Block getBlockType()`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `double getDistanceSq(double x, double y, double z)`
- `double getMaxRenderDistanceSquared()`
- `BlockPos getPos()`
- `AxisAlignedBB getRenderBoundingBox()` — Return an AxisAlignedBB that controls the visible scope of a TileEntitySpecialRenderer associated with this TileEntity Defaults to the collision bounding box Block#getCollisionBoundingBoxFromPool(World, int, int, int) associated with the block at this location.
- `NBTTagCompound getTileData()` — Gets a NBTTagCompound that can be used to store custom data for this tile entity.
- `SPacketUpdateTileEntity getUpdatePacket()`
- `NBTTagCompound getUpdateTag()`
- `World getWorld()`
- `void handleUpdateTag(NBTTagCompound tag)` — Called when the chunk's TE update tag, gotten from getUpdateTag() , is received on the client.
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean hasFastRenderer()` — If the TileEntitySpecialRenderer associated with this TileEntity can be batched in with another renderers, and won't access the GL state.
- `boolean hasWorldObj()`
- `void invalidate()`
- `boolean isInvalid()`
- `void markDirty()`
- `void onChunkUnload()` — Called when the chunk this TileEntity is on is Unloaded.
- `void onDataPacket(NetworkManager net, SPacketUpdateTileEntity pkt)` — Called when you receive a TileEntityData packet for the location this TileEntity is currently in.
- `void onLoad()` — Called from the Chunk when this is first added to the world.
- `boolean onlyOpsCanSetNbt()`
- `void readFromNBT(NBTTagCompound compound)`
- `boolean receiveClientEvent(int id, int type)`
- `boolean restrictNBTCopy()` — Determines if the player can overwrite the NBT data of this tile entity while they place it using a ItemStack.
- `NBTTagCompound serializeNBT()`
- `void setPos(BlockPos posIn)`
- `void setWorldObj(World worldIn)`
- `boolean shouldRefresh(World world, BlockPos pos, IBlockState oldState, IBlockState newSate)` — Called from Chunk.setBlockIDWithMetadata and Chunk.fillChunk, determines if this tile entity should be re-created when the ID, or Metadata changes.
- `boolean shouldRenderInPass(int pass)`
- `void updateContainingBlockInfo()`
- `void validate()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `protected Block blockType`
- `static AxisAlignedBB INFINITE_EXTENT_AABB` — Sometimes default render bounding box: infinite in scope.
- `protected BlockPos pos`
- `protected boolean tileEntityInvalid`
- `protected World worldObj`