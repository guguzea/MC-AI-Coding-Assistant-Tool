---
title: "EntityMooshroom"
description: "public class EntityMooshroom extends EntityCow implements IShearable"
package: "net/minecraft/entity/passive"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/passive/EntityMooshroom.html"
sourceType: javadoc
---

# EntityMooshroom

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityCow → net.minecraft.entity.passive.EntityMooshroom

## Class signature

```java
public class EntityMooshroom extends EntityCow implements IShearable
```

## Methods

- `EntityMooshroom createChild(EntityAgeable ageable)`
- `protected ResourceLocation getLootTable()`
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.
- `boolean processInteract(EntityPlayer player, EnumHand hand, ItemStack stack)`

## Fields

- `EntityMooshroom`
