---
title: "Explosion"
description: "Does the first part of the explosion (destroy blocks)"
package: "net/minecraft/world"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/Explosion.html"
sourceType: javadoc
---

# Explosion

## Class signature

```java
public class Explosion extends java.lang.Object
```

## Constructors

- `public Explosion( World worldIn, Entity p_i45752_2_, double p_i45752_3_, double p_i45752_5_, double p_i45752_7_, float p_i45752_9_, java.util.List< BlockPos > p_i45752_10_)`
- `public Explosion( World worldIn, Entity p_i45753_2_, double p_i45753_3_, double p_i45753_5_, double p_i45753_7_, float p_i45753_9_, boolean p_i45753_10_, boolean p_i45753_11_, java.util.List< BlockPos > p_i45753_12_)`
- `public Explosion( World worldIn, Entity p_i45754_2_, double p_i45754_3_, double p_i45754_5_, double p_i45754_7_, float size, boolean p_i45754_10_, boolean p_i45754_11_)`

## Methods

- `public void doExplosionA()`
- `public void doExplosionB(boolean spawnParticles)`
- `public java.util.Map< EntityPlayer , Vec3 > getPlayerKnockbackMap()`
- `public EntityLivingBase getExplosivePlacedBy()`
- `public void func_180342_d()`
- `public java.util.List< BlockPos > getAffectedBlockPositions()`
- `public Vec3 getPosition()`

## Description

Does the first part of the explosion (destroy blocks)
