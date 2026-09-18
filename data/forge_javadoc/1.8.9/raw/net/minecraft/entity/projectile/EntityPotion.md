---
title: "EntityPotion"
description: "Gets the amount of gravity to apply to the thrown entity with each tick."
package: "net/minecraft/entity/projectile"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/projectile/EntityPotion.html"
sourceType: javadoc
---

# EntityPotion

## Class signature

```java
public class EntityPotion extends EntityThrowable
```

## Constructors

- `public EntityPotion( World worldIn)`
- `public EntityPotion( World worldIn, EntityLivingBase throwerIn, int meta)`
- `public EntityPotion( World worldIn, EntityLivingBase throwerIn, ItemStack potionDamageIn)`
- `public EntityPotion( World worldIn, double x, double y, double z, int p_i1791_8_)`
- `public EntityPotion( World worldIn, double x, double y, double z, ItemStack potionDamageIn)`

## Methods

- `protected float getGravityVelocity()`
- `protected float getVelocity()`
- `protected float getInaccuracy()`
- `public void setPotionDamage(int potionId)`
- `public int getPotionDamage()`
- `protected void onImpact( MovingObjectPosition p_70184_1_)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`

## Description

Gets the amount of gravity to apply to the thrown entity with each tick.
