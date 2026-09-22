---
title: "EntityArrow"
description: "public abstract class EntityArrow extends Entity implements IProjectile"
package: "net/minecraft/entity/projectile"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/projectile/EntityArrow.html"
sourceType: javadoc
---

# EntityArrow

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityArrow

## Class signature

```java
public abstract class EntityArrow extends Entity implements IProjectile
```

## Constructors

- `EntityArrow(World worldIn)`
- `EntityArrow(World worldIn, double x, double y, double z)`
- `EntityArrow(World worldIn, EntityLivingBase shooter)`

## Methods

- `protected void arrowHit(EntityLivingBase living)`
- `boolean canBeAttackedWithItem()`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `protected Entity findEntityOnPath(Vec3d start, Vec3d end)`
- `protected abstract ItemStack getArrowStack()`
- `int getBrightnessForRender(float partialTicks)`
- `double getDamage()`
- `float getEyeHeight()`
- `boolean getIsCritical()`
- `boolean isInRangeToRenderDist(double distance)`
- `void onCollideWithPlayer(EntityPlayer entityIn)`
- `protected void onHit(RayTraceResult raytraceResultIn)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setAim(Entity p_184547_1_, float p_184547_2_, float p_184547_3_, float p_184547_4_, float p_184547_5_, float p_184547_6_)`
- `void setDamage(double damageIn)`
- `void setIsCritical(boolean critical)`
- `void setKnockbackStrength(int knockbackStrengthIn)`
- `void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `void setThrowableHeading(double x, double y, double z, float velocity, float inaccuracy)`
- `void setVelocity(double x, double y, double z)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `int arrowShake`
- `protected boolean inGround`
- `EntityArrow.PickupStatus pickupStatus`
- `Entity shootingEntity`
- `protected int timeInGround`
