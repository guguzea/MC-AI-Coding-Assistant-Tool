---
title: "EntityAgeable"
description: "public abstract class EntityAgeable extends EntityCreature"
package: "net/minecraft/entity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/EntityAgeable.html"
sourceType: javadoc
---

# EntityAgeable

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable

## Class signature

```java
public abstract class EntityAgeable extends EntityCreature
```

## Constructors

- `EntityAgeable(World worldIn)`

## Methods

- `void addGrowth(int growth)`
- `void ageUp(int p_175501_1_, boolean p_175501_2_)`
- `abstract EntityAgeable createChild(EntityAgeable ageable)`
- `protected void entityInit()`
- `int getGrowingAge()`
- `protected boolean holdingSpawnEggOfClass(ItemStack p_190669_1_, java.lang.Class<? extends Entity> p_190669_2_)`
- `boolean isChild()`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `protected void onGrowingAdult()`
- `void onLivingUpdate()`
- `boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setGrowingAge(int age)`
- `protected void setScale(float scale)`
- `void setScaleForAge(boolean child)`
- `protected void setSize(float width, float height)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected int forcedAge`
- `protected int forcedAgeTimer`
- `protected int growingAge`
