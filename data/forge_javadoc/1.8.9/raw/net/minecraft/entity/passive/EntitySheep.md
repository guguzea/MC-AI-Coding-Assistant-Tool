---
title: "EntitySheep"
description: "public class EntitySheep extends EntityAnimal implements IShearable"
package: "net/minecraft/entity/passive"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/passive/EntitySheep.html"
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
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `void eatGrassBonus()` — This function applies the benefits of growing back wool and faster growing up to the acting entity.
- `protected void entityInit()`
- `static float[] func_175513_a(EnumDyeColor dyeColor)`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `EnumDyeColor getFleeceColor()` — Gets the wool color of this sheep.
- `float getHeadRotationAngleX(float p_70890_1_)`
- `float getHeadRotationPointY(float p_70894_1_)`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `static EnumDyeColor getRandomSheepColor(java.util.Random random)` — Chooses a "vanilla" sheep color based on the provided random.
- `boolean getSheared()` — returns true if a sheeps wool has been sheared
- `void handleStatusUpdate(byte id)`
- `boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)` — Called only once on an entity when first time spawned, via egg, mob spawner, natural spawning etc, but not called when entity is reloaded from nbt.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setFleeceColor(EnumDyeColor color)` — Sets the wool color of this sheep
- `void setSheared(boolean sheared)` — make a sheep sheared if set to true
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntitySheep`
