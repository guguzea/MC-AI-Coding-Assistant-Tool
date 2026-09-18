---
title: "TileEntityStructure"
description: "public class TileEntityStructure extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityStructure.html"
sourceType: javadoc
---

# TileEntityStructure

## Class signature

```java
public class TileEntityStructure extends TileEntity
```

## Constructors

- `public TileEntityStructure()`

## Methods

- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public boolean usedBy( EntityPlayer player)`
- `public java.lang.String getName()`
- `public void setName(java.lang.String nameIn)`
- `public void createdBy( EntityLivingBase p_189720_1_)`
- `public BlockPos getPosition()`
- `public void setPosition( BlockPos posIn)`
- `public BlockPos getStructureSize()`
- `public void setSize( BlockPos sizeIn)`
- `public Mirror getMirror()`
- `public void setMirror( Mirror mirrorIn)`
- `public void setRotation( Rotation rotationIn)`
- `public void setMetadata(java.lang.String metadataIn)`
- `public Rotation getRotation()`
- `public java.lang.String getMetadata()`
- `public TileEntityStructure.Mode getMode()`
- `public void setMode( TileEntityStructure.Mode modeIn)`
- `public void setIgnoresEntities(boolean ignoreEntitiesIn)`
- `public void setIntegrity(float integrityIn)`
- `public void setSeed(long seedIn)`
- `public void nextMode()`
- `public boolean ignoresEntities()`
- `public float getIntegrity()`
- `public long getSeed()`
- `public boolean detectSize()`
- `public void writeCoordinates(io.netty.buffer.ByteBuf buf)`
- `public boolean save()`
- `public boolean save(boolean p_189712_1_)`
- `public boolean load()`
- `public boolean load(boolean p_189714_1_)`
- `public void unloadStructure()`
- `public boolean isStructureLoadable()`
- `public boolean isPowered()`
- `public void setPowered(boolean poweredIn)`
- `public boolean showsAir()`
- `public void setShowAir(boolean showAirIn)`
- `public boolean showsBoundingBox()`
- `public void setShowBoundingBox(boolean showBoundingBoxIn)`
- `@Nullable public ITextComponent getDisplayName()`
