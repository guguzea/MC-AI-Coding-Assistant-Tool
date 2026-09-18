---
title: "EntityArrow"
description: "public abstract class EntityArrow extends Entity implements IProjectile"
package: "net/minecraft/entity/projectile"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/projectile/EntityArrow.html"
sourceType: javadoc
---

# EntityArrow

## Class signature

```java
public abstract class EntityArrow extends Entity implements IProjectile
```

## Constructors

- `public EntityArrow( World worldIn)`
- `public EntityArrow( World worldIn, double x, double y, double z)`
- `public EntityArrow( World worldIn, EntityLivingBase shooter)`

## Methods

- `public boolean isInRangeToRenderDist(double distance)`
- `protected void entityInit()`
- `public void setAim( Entity shooter, float pitch, float yaw, float p_184547_4_, float velocity, float inaccuracy)`
- `public void setThrowableHeading(double x, double y, double z, float velocity, float inaccuracy)`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `protected void onHit( RayTraceResult raytraceResultIn)`
- `public void move( MoverType type, double x, double y, double z)`
- `protected void arrowHit( EntityLivingBase living)`
- `@Nullable protected Entity findEntityOnPath( Vec3d start, Vec3d end)`
- `public static void registerFixesArrow( DataFixer fixer, java.lang.String name)`
- `public static void registerFixesArrow( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void onCollideWithPlayer( EntityPlayer entityIn)`
- `protected abstract ItemStack getArrowStack()`
- `protected boolean canTriggerWalking()`
- `public void setDamage(double damageIn)`
- `public double getDamage()`
- `public void setKnockbackStrength(int knockbackStrengthIn)`
- `public boolean canBeAttackedWithItem()`
- `public float getEyeHeight()`
- `public void setIsCritical(boolean critical)`
- `public boolean getIsCritical()`
- `public void setEnchantmentEffectsFromEntity( EntityLivingBase p_190547_1_, float p_190547_2_)`
