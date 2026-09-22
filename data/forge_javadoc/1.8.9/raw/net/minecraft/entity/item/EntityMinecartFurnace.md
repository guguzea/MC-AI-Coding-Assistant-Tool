---
title: "EntityMinecartFurnace"
description: "public class EntityMinecartFurnace extends EntityMinecart"
package: "net/minecraft/entity/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityMinecartFurnace.html"
sourceType: javadoc
---

# EntityMinecartFurnace

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityMinecart → net.minecraft.entity.item.EntityMinecartFurnace

## Class signature

```java
public class EntityMinecartFurnace extends EntityMinecart
```

## Constructors

- `EntityMinecartFurnace(World worldIn)`
- `EntityMinecartFurnace(World worldIn, double p_i1719_2_, double p_i1719_4_, double p_i1719_6_)`

## Methods

- `protected void applyDrag()`
- `protected void entityInit()`
- `protected void func_180460_a(BlockPos p_180460_1_, IBlockState p_180460_2_)`
- `IBlockState getDefaultDisplayTile()`
- `protected double getMaximumSpeed()` — Get's the maximum speed for a minecart
- `EntityMinecart.EnumMinecartType getMinecartType()`
- `boolean interactFirst(EntityPlayer playerIn)` — First layer of player interaction
- `protected boolean isMinecartPowered()`
- `void killMinecart(DamageSource p_94095_1_)`
- `void onUpdate()` — Called to update the entity's position/logic.
- `protected void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `protected void setMinecartPowered(boolean p_94107_1_)`
- `protected void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `double pushX`
- `double pushZ`
