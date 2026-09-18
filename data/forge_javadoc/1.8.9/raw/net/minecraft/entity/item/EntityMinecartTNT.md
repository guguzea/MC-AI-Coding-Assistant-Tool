---
title: "EntityMinecartTNT"
description: "Called when the entity is attacked."
package: "net/minecraft/entity/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityMinecartTNT.html"
sourceType: javadoc
---

# EntityMinecartTNT

## Class signature

```java
public class EntityMinecartTNT extends EntityMinecart
```

## Constructors

- `public EntityMinecartTNT( World worldIn)`
- `public EntityMinecartTNT( World worldIn, double p_i1728_2_, double p_i1728_4_, double p_i1728_6_)`

## Methods

- `public EntityMinecart.EnumMinecartType getMinecartType()`
- `public IBlockState getDefaultDisplayTile()`
- `public void onUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void killMinecart( DamageSource p_94095_1_)`
- `protected void explodeCart(double p_94103_1_)`
- `public void fall(float distance, float damageMultiplier)`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `public void handleStatusUpdate(byte id)`
- `public void ignite()`
- `public int getFuseTicks()`
- `public boolean isIgnited()`
- `public float getExplosionResistance( Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn)`
- `public boolean verifyExplosion( Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn, float p_174816_5_)`
- `protected void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected void writeEntityToNBT( NBTTagCompound tagCompound)`

## Description

Called when the entity is attacked.
