---
title: "TileEntityEndGateway"
description: "public class TileEntityEndGateway extends TileEntity implements ITickable"
package: "net/minecraft/tileentity"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/tileentity/TileEntityEndGateway.html"
sourceType: javadoc
---

# TileEntityEndGateway

## Class signature

```java
public class TileEntityEndGateway extends TileEntity implements ITickable
```

## Constructors

- `public TileEntityEndGateway()`

## Methods

- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public double getMaxRenderDistanceSquared()`
- `public void update()`
- `public boolean isSpawning()`
- `public boolean isCoolingDown()`
- `public float getSpawnPercent()`
- `public float getCooldownPercent()`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public void triggerCooldown()`
- `public boolean receiveClientEvent(int id, int type)`
- `public void teleportEntity( Entity entityIn)`
- `public boolean shouldRenderFace( EnumFacing p_184313_1_)`
- `public int getParticleAmount()`
