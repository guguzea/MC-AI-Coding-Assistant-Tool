---
title: "WorldBorder"
description: "public class WorldBorder extends java.lang.Object"
package: "net/minecraft/world/border"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/border/WorldBorder.html"
sourceType: javadoc
---

# WorldBorder

**Inheritance:** java.lang.Object → net.minecraft.world.border.WorldBorder

## Class signature

```java
public class WorldBorder extends java.lang.Object
```

## Constructors

- `WorldBorder()`

## Methods

- `void addListener(IBorderListener listener)`
- `boolean contains(AxisAlignedBB bb)`
- `boolean contains(BlockPos pos)`
- `boolean contains(ChunkPos range)`
- `double getCenterX()`
- `double getCenterZ()`
- `double getClosestDistance(double x, double z)`
- `double getClosestDistance(Entity entityIn)`
- `double getDamageAmount()`
- `double getDamageBuffer()`
- `double getDiameter()`
- `protected java.util.List<IBorderListener> getListeners()`
- `double getResizeSpeed()`
- `int getSize()`
- `EnumBorderStatus getStatus()`
- `double getTargetSize()`
- `long getTimeUntilTarget()`
- `int getWarningDistance()`
- `int getWarningTime()`
- `double maxX()`
- `double maxZ()`
- `double minX()`
- `double minZ()`
- `void removeListener(IBorderListener listener)`
- `void setCenter(double x, double z)`
- `void setDamageAmount(double newAmount)`
- `void setDamageBuffer(double bufferSize)`
- `void setSize(int size)`
- `void setTransition(double newSize)`
- `void setTransition(double oldSize, double newSize, long time)`
- `void setWarningDistance(int warningDistance)`
- `void setWarningTime(int warningTime)`
