---
title: "EntityTameable"
description: "public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable"
package: "net/minecraft/entity/passive"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/passive/EntityTameable.html"
sourceType: javadoc
---

# EntityTameable

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityTameable

## Class signature

```java
public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable
```

## Constructors

- `EntityTameable(World worldIn)`

## Methods

- `boolean canBeLeashedTo(EntityPlayer player)`
- `protected void entityInit()`
- `EntityAISit getAISit()`
- `EntityLivingBase getOwner()`
- `java.util.UUID getOwnerId()`
- `Team getTeam()`
- `void handleStatusUpdate(byte id)`
- `boolean isOnSameTeam(Entity entityIn)`
- `boolean isOwner(EntityLivingBase entityIn)`
- `boolean isSitting()`
- `boolean isTamed()`
- `void onDeath(DamageSource cause)`
- `protected void playTameEffect(boolean play)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setOwnerId(java.util.UUID p_184754_1_)`
- `void setSitting(boolean sitting)`
- `void setTamed(boolean tamed)`
- `void setTamedBy(EntityPlayer player)`
- `protected void setupTamedAI()`
- `boolean shouldAttackEntity(EntityLivingBase target, EntityLivingBase owner)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected EntityAISit aiSit`
- `protected static DataParameter<<any>> OWNER_UNIQUE_ID`
- `protected static DataParameter<java.lang.Byte> TAMED`
