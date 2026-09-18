---
title: "EntityTameable"
description: "public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable"
package: "net/minecraft/entity/passive"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/passive/EntityTameable.html"
sourceType: javadoc
---

# EntityTameable

## Class signature

```java
public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable
```

## Constructors

- `public EntityTameable( World worldIn)`

## Methods

- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean canBeLeashedTo( EntityPlayer player)`
- `protected void playTameEffect(boolean play)`
- `public void handleStatusUpdate(byte id)`
- `public boolean isTamed()`
- `public void setTamed(boolean tamed)`
- `protected void setupTamedAI()`
- `public boolean isSitting()`
- `public void setSitting(boolean sitting)`
- `public java.util.UUID getOwnerId()`
- `public void setOwnerId(java.util.UUID p_184754_1_)`
- `public void setTamedBy( EntityPlayer player)`
- `public EntityLivingBase getOwner()`
- `public boolean isOwner( EntityLivingBase entityIn)`
- `public EntityAISit getAISit()`
- `public boolean shouldAttackEntity( EntityLivingBase target, EntityLivingBase owner)`
- `public Team getTeam()`
- `public boolean isOnSameTeam( Entity entityIn)`
- `public void onDeath( DamageSource cause)`
