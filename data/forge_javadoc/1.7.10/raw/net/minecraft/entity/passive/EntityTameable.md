---
title: "EntityTameable"
description: "public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable"
package: "net/minecraft/entity/passive"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/passive/EntityTameable.html"
sourceType: javadoc
---

# EntityTameable

## Class signature

```java
public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable
```

## Constructors

- `public EntityTameable( World p_i1604_1_)`

## Methods

- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `public void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `protected void playTameEffect(boolean p_70908_1_)`
- `public void handleHealthUpdate(byte p_70103_1_)`
- `public boolean isTamed()`
- `public void setTamed(boolean p_70903_1_)`
- `public boolean isSitting()`
- `public void setSitting(boolean p_70904_1_)`
- `public java.lang.String func_152113_b()`
- `public void func_152115_b(java.lang.String p_152115_1_)`
- `public EntityLivingBase getOwner()`
- `public boolean func_152114_e( EntityLivingBase p_152114_1_)`
- `public EntityAISit func_70907_r()`
- `public boolean func_142018_a( EntityLivingBase p_142018_1_, EntityLivingBase p_142018_2_)`
- `public Team getTeam()`
- `public boolean isOnSameTeam( EntityLivingBase p_142014_1_)`
