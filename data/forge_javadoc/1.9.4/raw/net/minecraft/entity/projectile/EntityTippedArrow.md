---
title: "EntityTippedArrow"
description: "public class EntityTippedArrow extends EntityArrow"
package: "net/minecraft/entity/projectile"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/projectile/EntityTippedArrow.html"
sourceType: javadoc
---

# EntityTippedArrow

## Class signature

```java
public class EntityTippedArrow extends EntityArrow
```

## Constructors

- `public EntityTippedArrow( World worldIn)`
- `public EntityTippedArrow( World worldIn, double x, double y, double z)`
- `public EntityTippedArrow( World worldIn, EntityLivingBase shooter)`

## Methods

- `public void setPotionEffect( ItemStack stack)`
- `public void addEffect( PotionEffect effect)`
- `protected void entityInit()`
- `public void onUpdate()`
- `public int getColor()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected void arrowHit( EntityLivingBase living)`
- `protected ItemStack getArrowStack()`
- `public void handleStatusUpdate(byte id)`
