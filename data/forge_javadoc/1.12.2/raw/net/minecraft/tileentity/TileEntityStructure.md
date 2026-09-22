---
title: "TileEntityStructure"
description: "public class TileEntityStructure extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/tileentity/TileEntityStructure.html"
sourceType: javadoc
---

# TileEntityStructure

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityStructure

## Class signature

```java
public class TileEntityStructure extends TileEntity
```

## Methods

- `void createdBy(EntityLivingBase p_189720_1_)`
- `boolean detectSize()`
- `ITextComponent getDisplayName()`
- `float getIntegrity()`
- `java.lang.String getMetadata()`
- `Mirror getMirror()`
- `TileEntityStructure.Mode getMode()`
- `java.lang.String getName()`
- `BlockPos getPosition()`
- `Rotation getRotation()`
- `long getSeed()`
- `BlockPos getStructureSize()`
- `SPacketUpdateTileEntity getUpdatePacket()`
- `NBTTagCompound getUpdateTag()`
- `boolean ignoresEntities()`
- `boolean isPowered()`
- `boolean isStructureLoadable()`
- `boolean load()`
- `boolean load(boolean requireMatchingSize)`
- `void nextMode()`
- `void readFromNBT(NBTTagCompound compound)`
- `boolean save()`
- `boolean save(boolean writeToDisk)`
- `void setIgnoresEntities(boolean ignoreEntitiesIn)`
- `void setIntegrity(float integrityIn)`
- `void setMetadata(java.lang.String metadataIn)`
- `void setMirror(Mirror mirrorIn)`
- `void setMode(TileEntityStructure.Mode modeIn)`
- `void setName(java.lang.String nameIn)`
- `void setPosition(BlockPos posIn)`
- `void setPowered(boolean poweredIn)`
- `void setRotation(Rotation rotationIn)`
- `void setSeed(long seedIn)`
- `void setShowAir(boolean showAirIn)`
- `void setShowBoundingBox(boolean showBoundingBoxIn)`
- `void setSize(BlockPos sizeIn)`
- `boolean showsAir()`
- `boolean showsBoundingBox()`
- `void unloadStructure()`
- `boolean usedBy(EntityPlayer player)`
- `void writeCoordinates(ByteBuf buf)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityStructure`
