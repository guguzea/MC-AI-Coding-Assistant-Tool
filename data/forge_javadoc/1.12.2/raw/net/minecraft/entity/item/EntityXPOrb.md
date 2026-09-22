---
title: "EntityXPOrb"
description: "public class EntityXPOrb extends Entity"
package: "net/minecraft/entity/item"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/item/EntityXPOrb.html"
sourceType: javadoc
---

# EntityXPOrb

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityXPOrb

## Class signature

```java
public class EntityXPOrb extends Entity
```

## Constructors

- `EntityXPOrb(World worldIn)`
- `EntityXPOrb(World worldIn, double x, double y, double z, int expValue)`

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeAttackedWithItem()`
- `protected boolean canTriggerWalking()`
- `protected void dealFireDamage(int amount)`
- `protected void entityInit()`
- `int getBrightnessForRender()`
- `int getTextureByXP()`
- `static int getXPSplit(int expValue)`
- `int getXpValue()`
- `boolean handleWaterMovement()`
- `void onCollideWithPlayer(EntityPlayer entityIn)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `int delayBeforeCanPickup`
- `int xpColor`
- `int xpOrbAge`
- `int xpValue`
