---
title: "EntityArrow"
description: "public class EntityArrow extends Entity implements IProjectile"
package: "net/minecraft/entity/projectile"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/projectile/EntityArrow.html"
sourceType: javadoc
---

# EntityArrow

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityArrow

## Class signature

```java
public class EntityArrow extends Entity implements IProjectile
```

## Constructors

- `EntityArrow(World worldIn)`
- `EntityArrow(World worldIn, double x, double y, double z)`
- `EntityArrow(World worldIn, EntityLivingBase shooter, EntityLivingBase p_i1755_3_, float p_i1755_4_, float p_i1755_5_)`
- `EntityArrow(World worldIn, EntityLivingBase shooter, float velocity)`

## Methods

- `boolean canAttackWithItem()` — If returns false, the item will not inflict any damage against entities.
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void entityInit()`
- `double getDamage()`
- `float getEyeHeight()`
- `boolean getIsCritical()` — Whether the arrow has a stream of critical hit particles flying behind it.
- `void onCollideWithPlayer(EntityPlayer entityIn)` — Called by a player entity when they collide with an entity
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setDamage(double damageIn)`
- `void setIsCritical(boolean critical)` — Whether the arrow has a stream of critical hit particles flying behind it.
- `void setKnockbackStrength(int knockbackStrengthIn)` — Sets the amount of knockback the arrow applies when it hits a mob.
- `void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `void setThrowableHeading(double x, double y, double z, float velocity, float inaccuracy)` — Similar to setArrowHeading, it's point the throwable entity to a x, y, z direction.
- `void setVelocity(double x, double y, double z)` — Sets the velocity to the args.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `int arrowShake` — Seems to be some sort of timer for animating an arrow.
- `int canBePickedUp` — 1 if the player can pick up the arrow
- `Entity shootingEntity` — The owner of this arrow.
