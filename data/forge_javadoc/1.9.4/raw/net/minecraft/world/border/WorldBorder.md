---
title: "WorldBorder"
description: "public class WorldBorder extends java.lang.Object"
package: "net/minecraft/world/border"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/border/WorldBorder.html"
sourceType: javadoc
---

# WorldBorder

## Class signature

```java
public class WorldBorder extends java.lang.Object
```

## Constructors

- `public WorldBorder()`

## Methods

- `public boolean contains( BlockPos pos)`
- `public boolean contains( ChunkPos range)`
- `public boolean contains( AxisAlignedBB bb)`
- `public double getClosestDistance( Entity entityIn)`
- `public double getClosestDistance(double x, double z)`
- `public EnumBorderStatus getStatus()`
- `public double minX()`
- `public double minZ()`
- `public double maxX()`
- `public double maxZ()`
- `public double getCenterX()`
- `public double getCenterZ()`
- `public void setCenter(double x, double z)`
- `public double getDiameter()`
- `public long getTimeUntilTarget()`
- `public double getTargetSize()`
- `public void setTransition(double newSize)`
- `public void setTransition(double oldSize, double newSize, long time)`
- `protected java.util.List< IBorderListener > getListeners()`
- `public void addListener( IBorderListener listener)`
- `public void setSize(int size)`
- `public int getSize()`
- `public double getDamageBuffer()`
- `public void setDamageBuffer(double bufferSize)`
- `public double getDamageAmount()`
- `public void setDamageAmount(double newAmount)`
- `public double getResizeSpeed()`
- `public int getWarningTime()`
- `public void setWarningTime(int warningTime)`
- `public int getWarningDistance()`
- `public void setWarningDistance(int warningDistance)`
- `public void removeListener( IBorderListener listener)`
