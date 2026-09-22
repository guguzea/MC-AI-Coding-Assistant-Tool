---
title: "EntityMinecartFurnace"
description: "public class EntityMinecartFurnace extends EntityMinecart"
package: "net/minecraft/entity/item"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/item/EntityMinecartFurnace.html"
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
- `EntityMinecartFurnace(World worldIn, double x, double y, double z)`

## Methods

- `protected void applyDrag()`
- `protected void entityInit()`
- `IBlockState getDefaultDisplayTile()`
- `protected double getMaximumSpeed()`
- `EntityMinecart.Type getType()`
- `protected boolean isMinecartPowered()`
- `void killMinecart(DamageSource source)`
- `protected void moveAlongTrack(BlockPos p_180460_1_, IBlockState p_180460_2_)`
- `void onUpdate()`
- `boolean processInitialInteract(EntityPlayer player, ItemStack stack, EnumHand hand)`
- `protected void readEntityFromNBT(NBTTagCompound compound)`
- `protected void setMinecartPowered(boolean p_94107_1_)`
- `protected void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `double pushX`
- `double pushZ`
