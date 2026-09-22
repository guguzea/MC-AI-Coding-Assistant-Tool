---
title: "Explosion"
description: "public class Explosion extends java.lang.Object"
package: "net/minecraft/world"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/Explosion.html"
sourceType: javadoc
---

# Explosion

**Inheritance:** java.lang.Object → net.minecraft.world.Explosion

## Class signature

```java
public class Explosion extends java.lang.Object
```

## Constructors

- `Explosion(World worldIn, Entity entityIn, double x, double y, double z, float size, boolean flaming, boolean smoking)`
- `Explosion(World worldIn, Entity entityIn, double x, double y, double z, float size, boolean flaming, boolean smoking, java.util.List<BlockPos> affectedPositions)`
- `Explosion(World worldIn, Entity entityIn, double x, double y, double z, float size, java.util.List<BlockPos> affectedPositions)`

## Methods

- `void clearAffectedBlockPositions()`
- `void doExplosionA()`
- `void doExplosionB(boolean spawnParticles)`
- `java.util.List<BlockPos> getAffectedBlockPositions()`
- `EntityLivingBase getExplosivePlacedBy()`
- `java.util.Map<EntityPlayer, Vec3d> getPlayerKnockbackMap()`
- `Vec3d getPosition()`
