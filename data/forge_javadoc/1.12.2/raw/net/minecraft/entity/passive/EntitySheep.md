---
title: "EntitySheep"
description: "public class EntitySheep extends EntityAnimal implements IShearable"
package: "net/minecraft/entity/passive"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/passive/EntitySheep.html"
sourceType: javadoc
---

# EntitySheep

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntitySheep

## Class signature

```java
public class EntitySheep extends EntityAnimal implements IShearable
```

## Methods

- `protected void applyEntityAttributes()`
- `EntitySheep createChild(EntityAgeable ageable)`
- `void eatGrassBonus()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getDeathSound()`
- `static float[] getDyeRgb(EnumDyeColor dyeColor)`
- `float getEyeHeight()`
- `EnumDyeColor getFleeceColor()`
- `float getHeadRotationAngleX(float p_70890_1_)`
- `float getHeadRotationPointY(float p_70894_1_)`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `static EnumDyeColor getRandomSheepColor(java.util.Random random)`
- `boolean getSheared()`
- `void handleStatusUpdate(byte id)`
- `protected void initEntityAI()`
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onLivingUpdate()`
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesSheep(DataFixer fixer)`
- `void setFleeceColor(EnumDyeColor color)`
- `void setSheared(boolean sheared)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntitySheep`
