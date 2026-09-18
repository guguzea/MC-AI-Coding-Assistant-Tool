---
title: "TileEntity"
description: "the Block type that this TileEntity is contained within"
package: "net/minecraft/tileentity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntity.html"
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

- `public static void addMapping(java.lang.Class<? extends TileEntity > cl, java.lang.String id)`
- `public World getWorld()`
- `public void setWorldObj( World worldIn)`
- `public boolean hasWorldObj()`
- `public void readFromNBT( NBTTagCompound compound)`
- `public void writeToNBT( NBTTagCompound compound)`
- `public static TileEntity createAndLoadEntity( NBTTagCompound nbt)`
- `public int getBlockMetadata()`
- `public void markDirty()`
- `public double getDistanceSq(double x, double y, double z)`
- `public double getMaxRenderDistanceSquared()`
- `public BlockPos getPos()`
- `public Block getBlockType()`
- `public Packet getDescriptionPacket()`
- `public boolean isInvalid()`
- `public void invalidate()`
- `public void validate()`
- `public boolean receiveClientEvent(int id, int type)`
- `public void updateContainingBlockInfo()`
- `public void addInfoToCrashReport( CrashReportCategory reportCategory)`
- `public void setPos( BlockPos posIn)`
- `public boolean func_183000_F()`
- `public void onDataPacket( NetworkManager net, S35PacketUpdateTileEntity pkt)`
- `public void onChunkUnload()`
- `public boolean shouldRefresh( World world, BlockPos pos, IBlockState oldState, IBlockState newSate)`
- `public boolean shouldRenderInPass(int pass)`
- `public AxisAlignedBB getRenderBoundingBox()`
- `public boolean canRenderBreaking()`
- `public NBTTagCompound getTileData()`
- `public boolean restrictNBTCopy()`
- `public void onLoad()`
- `public boolean hasFastRenderer()`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public void deserializeNBT( NBTTagCompound nbt)`
- `public NBTTagCompound serializeNBT()`

## Description

the Block type that this TileEntity is contained within
