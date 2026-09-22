---
title: "EntityCreature"
description: "public abstract class EntityCreature extends EntityLiving"
package: "net/minecraft/entity"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/EntityCreature.html"
sourceType: javadoc
---

# EntityCreature

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature

## Class signature

```java
public abstract class EntityCreature extends EntityLiving
```

## Constructors

- `EntityCreature(World p_i1602_1_)`

## Methods

- `protected void attackEntity(Entity p_70785_1_, float p_70785_2_)`
- `void detachHome()`
- `protected Entity findPlayerToAttack()`
- `float func_110174_bM()`
- `protected void func_142017_o(float p_142017_1_)`
- `float getBlockPathWeight(int p_70783_1_, int p_70783_2_, int p_70783_3_)`
- `boolean getCanSpawnHere()`
- `Entity getEntityToAttack()`
- `ChunkCoordinates getHomePosition()`
- `boolean hasHome()`
- `boolean hasPath()`
- `protected boolean isMovementCeased()`
- `boolean isWithinHomeDistance(int p_110176_1_, int p_110176_2_, int p_110176_3_)`
- `boolean isWithinHomeDistanceCurrentPosition()`
- `void setHomeArea(int p_110171_1_, int p_110171_2_, int p_110171_3_, int p_110171_4_)`
- `void setPathToEntity(PathEntity p_70778_1_)`
- `void setTarget(Entity p_70784_1_)`
- `protected void updateEntityActionState()`
- `protected void updateLeashedState()`
- `protected void updateWanderPath()`

## Fields

- `protected Entity entityToAttack`
- `static java.util.UUID field_110179_h`
- `static AttributeModifier field_110181_i`
- `protected int fleeingTick`
- `protected boolean hasAttacked`
