---
title: "TileEntityStructure"
description: "public class TileEntityStructure extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/tileentity/TileEntityStructure.html"
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
- `public void setName(java.lang.String nameIn)`
- `public void setPosition( BlockPos posIn)`
- `public void setSize( BlockPos sizeIn)`
- `public void setMirror( Mirror mirrorIn)`
- `public void setRotation( Rotation rotationIn)`
- `public void setMetadata(java.lang.String metadataIn)`
- `public void setMode( TileEntityStructure.Mode modeIn)`
- `public void setIgnoresEntities(boolean ignoreEntitiesIn)`
- `public boolean detectSize()`
- `public boolean save()`
- `public boolean load()`
