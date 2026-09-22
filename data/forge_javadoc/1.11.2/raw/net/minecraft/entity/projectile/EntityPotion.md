---
title: "EntityPotion"
description: "public class EntityPotion extends EntityThrowable"
package: "net/minecraft/entity/projectile"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/projectile/EntityPotion.html"
sourceType: javadoc
---

# EntityPotion

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityThrowable → net.minecraft.entity.projectile.EntityPotion

## Class signature

```java
public class EntityPotion extends EntityThrowable
```

## Constructors

- `EntityPotion(World worldIn)`
- `EntityPotion(World worldIn, double x, double y, double z, ItemStack potionDamageIn)`
- `EntityPotion(World worldIn, EntityLivingBase throwerIn, ItemStack potionDamageIn)`

## Methods

- `protected void entityInit()`
- `protected float getGravityVelocity()`
- `ItemStack getPotion()`
- `protected void onImpact(RayTraceResult result)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesPotion(DataFixer fixer)`
- `void setItem(ItemStack stack)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `static com.google.common.base.Predicate<EntityLivingBase> WATER_SENSITIVE`
