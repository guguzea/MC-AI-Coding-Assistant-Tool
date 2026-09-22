---
title: "Explosion"
description: "public class Explosion extends java.lang.Object"
package: "net/minecraft/world"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/Explosion.html"
sourceType: javadoc
---

# Explosion

**Inheritance:** java.lang.Object → net.minecraft.world.Explosion

## Class signature

```java
public class Explosion extends java.lang.Object
```

## Constructors

- `Explosion(World worldIn, Entity p_i45754_2_, double p_i45754_3_, double p_i45754_5_, double p_i45754_7_, float size, boolean p_i45754_10_, boolean p_i45754_11_)`
- `Explosion(World worldIn, Entity p_i45753_2_, double p_i45753_3_, double p_i45753_5_, double p_i45753_7_, float p_i45753_9_, boolean p_i45753_10_, boolean p_i45753_11_, java.util.List<BlockPos> p_i45753_12_)`
- `Explosion(World worldIn, Entity p_i45752_2_, double p_i45752_3_, double p_i45752_5_, double p_i45752_7_, float p_i45752_9_, java.util.List<BlockPos> p_i45752_10_)`

## Methods

- `void doExplosionA()` — Does the first part of the explosion (destroy blocks)
- `void doExplosionB(boolean spawnParticles)` — Does the second part of the explosion (sound, particles, drop spawn)
- `void func_180342_d()`
- `java.util.List<BlockPos> getAffectedBlockPositions()`
- `EntityLivingBase getExplosivePlacedBy()` — Returns either the entity that placed the explosive block, the entity that caused the explosion or null.
- `java.util.Map<EntityPlayer, Vec3> getPlayerKnockbackMap()`
- `Vec3 getPosition()`
