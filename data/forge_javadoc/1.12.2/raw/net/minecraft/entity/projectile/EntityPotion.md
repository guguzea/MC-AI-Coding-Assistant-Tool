---
title: "EntityPotion"
description: "public class EntityPotion extends EntityThrowable"
package: "net/minecraft/entity/projectile"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/projectile/EntityPotion.html"
sourceType: javadoc
---

# EntityPotion

## Class signature

```java
public class EntityPotion extends EntityThrowable
```

## Constructors

- `public EntityPotion( World worldIn)`
- `public EntityPotion( World worldIn, EntityLivingBase throwerIn, ItemStack potionDamageIn)`
- `public EntityPotion( World worldIn, double x, double y, double z, ItemStack potionDamageIn)`

## Methods

- `protected void entityInit()`
- `public ItemStack getPotion()`
- `public void setItem( ItemStack stack)`
- `protected float getGravityVelocity()`
- `protected void onImpact( RayTraceResult result)`
- `public static void registerFixesPotion( DataFixer fixer)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
