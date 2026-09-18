---
title: "EntitySheep"
description: "Checks if the object is currently shearable Example: Sheep return false when they have no wool"
package: "net/minecraft/entity/passive"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/passive/EntitySheep.html"
sourceType: javadoc
---

# EntitySheep

## Class signature

```java
public class EntitySheep extends EntityAnimal implements IShearable
```

## Constructors

- `public EntitySheep( World worldIn)`

## Methods

- `public static float[] getDyeRgb( EnumDyeColor dyeColor)`
- `protected void initEntityAI()`
- `protected void updateAITasks()`
- `public void onLivingUpdate()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public void handleStatusUpdate(byte id)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `public float getHeadRotationPointY(float p_70894_1_)`
- `public float getHeadRotationAngleX(float p_70890_1_)`
- `public static void registerFixesSheep( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public EnumDyeColor getFleeceColor()`
- `public void setFleeceColor( EnumDyeColor color)`
- `public boolean getSheared()`
- `public void setSheared(boolean sheared)`
- `public static EnumDyeColor getRandomSheepColor(java.util.Random random)`
- `public EntitySheep createChild( EntityAgeable ageable)`
- `public void eatGrassBonus()`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `public float getEyeHeight()`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Checks if the object is currently shearable Example: Sheep return false when they have no wool
