---
title: "EntityMinecartTNT"
description: "public class EntityMinecartTNT extends EntityMinecart"
package: "net/minecraft/entity/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/item/EntityMinecartTNT.html"
sourceType: javadoc
---

# EntityMinecartTNT

## Class signature

```java
public class EntityMinecartTNT extends EntityMinecart
```

## Constructors

- `public EntityMinecartTNT( World worldIn)`
- `public EntityMinecartTNT( World worldIn, double x, double y, double z)`

## Methods

- `public static void registerFixesMinecartTNT( DataFixer fixer)`
- `public EntityMinecart.Type getType()`
- `public IBlockState getDefaultDisplayTile()`
- `public void onUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void killMinecart( DamageSource source)`
- `protected void explodeCart(double p_94103_1_)`
- `public void fall(float distance, float damageMultiplier)`
- `public void onActivatorRailPass(int x, int y, int z, boolean receivingPower)`
- `public void handleStatusUpdate(byte id)`
- `public void ignite()`
- `public int getFuseTicks()`
- `public boolean isIgnited()`
- `public float getExplosionResistance( Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn)`
- `public boolean verifyExplosion( Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn, float p_174816_5_)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
