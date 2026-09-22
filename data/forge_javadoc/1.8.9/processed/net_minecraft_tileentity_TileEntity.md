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
- `static void addMapping(java.lang.Class<? extends TileEntity> cl, java.lang.String id)` — Adds a new two-way mapping between the class and its string name in both hashmaps.
- `boolean canRenderBreaking()` — Checks if this tile entity knows how to render its 'breaking' overlay effect.
- `static TileEntity createAndLoadEntity(NBTTagCompound nbt)` — Creates a new entity and loads its data from the specified NBT.
- `void deserializeNBT(NBTTagCompound nbt)`
- `boolean func_183000_F()`
- `int getBlockMetadata()`
- `Block getBlockType()` — Gets the block type at the location of this entity (client-only).
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `Packet getDescriptionPacket()` — Allows for a specialized description packet to be created.
- `double getDistanceSq(double x, double y, double z)` — Returns the square of the distance between this entity and the passed in coordinates.
- `double getMaxRenderDistanceSquared()`
- `BlockPos getPos()`
- `AxisAlignedBB getRenderBoundingBox()` — Return an AxisAlignedBB that controls the visible scope of a TileEntitySpecialRenderer associated with this TileEntity Defaults to the collision bounding box Block#getCollisionBoundingBoxFromPool(World, int, int, int) associated with the block at this location.
- `NBTTagCompound getTileData()` — Gets a NBTTagCompound that can be used to store custom data for this tile entity.
- `World getWorld()` — Returns the worldObj for this tileEntity.
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean hasFastRenderer()` — If the TileEntitySpecialRenderer associated with this TileEntity can be batched in with another renderers, and won't access the GL state.
- `boolean hasWorldObj()` — Returns true if the worldObj isn't null.
- `void invalidate()` — invalidates a tile entity
- `boolean isInvalid()`
- `void markDirty()` — For tile entities, ensures the chunk containing the tile entity is saved to disk later - the game won't think it hasn't changed and skip it.
- `void onChunkUnload()` — Called when the chunk this TileEntity is on is Unloaded.
- `void onDataPacket(NetworkManager net, S35PacketUpdateTileEntity pkt)` — Called when you receive a TileEntityData packet for the location this TileEntity is currently in.
- `void onLoad()` — Called from the Chunk when this is first added to the world.
- `void readFromNBT(NBTTagCompound compound)`
- `boolean receiveClientEvent(int id, int type)`
- `boolean restrictNBTCopy()` — Determines if the player can overwrite the NBT data of this tile entity while they place it using a ItemStack.
- `NBTTagCompound serializeNBT()`
- `void setPos(BlockPos posIn)`
- `void setWorldObj(World worldIn)` — Sets the worldObj for this tileEntity.
- `boolean shouldRefresh(World world, BlockPos pos, IBlockState oldState, IBlockState newSate)` — Called from Chunk.setBlockIDWithMetadata and Chunk.fillChunk, determines if this tile entity should be re-created when the ID, or Metadata changes.
- `boolean shouldRenderInPass(int pass)`
- `void updateContainingBlockInfo()`
- `void validate()` — validates a tile entity
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `protected Block blockType` — the Block type that this TileEntity is contained within
- `static AxisAlignedBB INFINITE_EXTENT_AABB` — Sometimes default render bounding box: infinite in scope.
- `protected BlockPos pos`
- `protected boolean tileEntityInvalid`
- `protected World worldObj` — the instance of the world the tile entity is in.