---
title: "Explosion"
description: "public class Explosion extends java.lang.Object"
package: "net/minecraft/world"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/Explosion.html"
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
