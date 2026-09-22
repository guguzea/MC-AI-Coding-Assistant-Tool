---
title: "EntityMooshroom"
description: "public class EntityMooshroom extends EntityCow implements IShearable"
package: "net/minecraft/entity/passive"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/passive/EntityMooshroom.html"
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
- `static void registerFixesMooshroom(DataFixer fixer)`

## Fields

- `EntityMooshroom`
