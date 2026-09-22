---
title: "EntityMinecartTNT"
description: "public class EntityMinecartTNT extends EntityMinecart"
package: "net/minecraft/entity/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityMinecartTNT.html"
sourceType: javadoc
---

# EntityMinecartTNT

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityMinecart → net.minecraft.entity.item.EntityMinecartTNT

## Class signature

```java
public class EntityMinecartTNT extends EntityMinecart
```

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `protected void explodeCart(double p_94103_1_)` — Makes the minecart explode.
- `void fall(float distance, float damageMultiplier)`
- `IBlockState getDefaultDisplayTile()`
- `float getExplosionResistance(Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn)` — Explosion resistance of a block relative to this entity
- `int getFuseTicks()` — Gets the remaining fuse time in ticks.
- `EntityMinecart.EnumMinecartType getMinecartType()`
- `void handleStatusUpdate(byte id)`
- `void ignite()` — Ignites this TNT cart.
- `boolean isIgnited()` — Returns true if the TNT minecart is ignited.
- `void killMinecart(DamageSource p_94095_1_)`
- `void onActivatorRailPass(int x, int y, int z, boolean receivingPower)` — Called every tick the minecart is on an activator rail.
- `void onUpdate()` — Called to update the entity's position/logic.
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `boolean verifyExplosion(Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn, float p_174816_5_)`
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityMinecartTNT`
- `EntityMinecartTNT`
