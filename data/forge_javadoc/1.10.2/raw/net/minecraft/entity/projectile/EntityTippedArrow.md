---
title: "EntityTippedArrow"
description: "public class EntityTippedArrow extends EntityArrow"
package: "net/minecraft/entity/projectile"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/projectile/EntityTippedArrow.html"
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
- `public static void registerFixesTippedArrow( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected void arrowHit( EntityLivingBase living)`
- `protected ItemStack getArrowStack()`
- `public void handleStatusUpdate(byte id)`
