---
title: "TileEntity"
description: "Sometimes default render bounding box: infinite in scope."
package: "net/minecraftforge/client/model/animation"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntity.html"
sourceType: javadoc
---

# TileEntity

## Class signature

```java
public abstract class TileEntity extends java.lang.Object implements ICapabilitySerializable < NBTTagCompound >
```

## Constructors

- `public TileEntity()`

## Methods

- `@Nullable public static ResourceLocation getKey(java.lang.Class<? extends TileEntity > p_190559_0_)`
- `public World getWorld()`
- `public void setWorld( World worldIn)`
- `public boolean hasWorld()`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `@Nullable public static TileEntity create( World worldIn, NBTTagCompound compound)`
- `protected void setWorldCreate( World worldIn)`
- `public int getBlockMetadata()`
- `public void markDirty()`
- `public double getDistanceSq(double x, double y, double z)`
- `public double getMaxRenderDistanceSquared()`
- `public BlockPos getPos()`
- `public Block getBlockType()`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public boolean isInvalid()`
- `public void invalidate()`
- `public void validate()`
- `public boolean receiveClientEvent(int id, int type)`
- `public void updateContainingBlockInfo()`
- `public void addInfoToCrashReport( CrashReportCategory reportCategory)`
- `public void setPos( BlockPos posIn)`
- `public boolean onlyOpsCanSetNbt()`
- `@Nullable public ITextComponent getDisplayName()`
- `public void rotate( Rotation rotationIn)`
- `public void mirror( Mirror mirrorIn)`
- `public void onDataPacket( NetworkManager net, SPacketUpdateTileEntity pkt)`
- `public void handleUpdateTag( NBTTagCompound tag)`
- `public void onChunkUnload()`
- `public boolean shouldRefresh( World world, BlockPos pos, IBlockState oldState, IBlockState newSate)`
- `public boolean shouldRenderInPass(int pass)`
- `public AxisAlignedBB getRenderBoundingBox()`
- `public boolean canRenderBreaking()`
- `public NBTTagCompound getTileData()`
- `public boolean restrictNBTCopy()`
- `public void onLoad()`
- `public boolean hasFastRenderer()`
- `public boolean hasCapability( Capability <?> capability, @Nullable EnumFacing facing)`
- `@Nullable public <T> T getCapability( Capability <T> capability, @Nullable EnumFacing facing)`
- `public void deserializeNBT( NBTTagCompound nbt)`
- `public NBTTagCompound serializeNBT()`

## Description

Sometimes default render bounding box: infinite in scope.
