---
title: "EntityChicken"
description: "public class EntityChicken extends EntityAnimal"
package: "net/minecraft/entity/passive"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/passive/EntityChicken.html"
sourceType: javadoc
---

# EntityChicken

## Class signature

```java
public class EntityChicken extends EntityAnimal
```

## Constructors

- `public EntityChicken( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `public float getEyeHeight()`
- `protected void applyEntityAttributes()`
- `public void onLivingUpdate()`
- `public void fall(float distance, float damageMultiplier)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public EntityChicken createChild( EntityAgeable ageable)`
- `public boolean isBreedingItem(@Nullable ItemStack stack)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected int getExperiencePoints( EntityPlayer player)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `protected boolean canDespawn()`
- `public void updatePassenger( Entity passenger)`
- `public boolean isChickenJockey()`
- `public void setChickenJockey(boolean jockey)`
