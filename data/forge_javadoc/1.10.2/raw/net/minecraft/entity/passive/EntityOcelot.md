---
title: "EntityOcelot"
description: "public class EntityOcelot extends EntityTameable"
package: "net/minecraft/entity/passive"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/passive/EntityOcelot.html"
sourceType: javadoc
---

# EntityOcelot

## Class signature

```java
public class EntityOcelot extends EntityTameable
```

## Constructors

- `public EntityOcelot( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void entityInit()`
- `public void updateAITasks()`
- `protected boolean canDespawn()`
- `protected void applyEntityAttributes()`
- `public void fall(float distance, float damageMultiplier)`
- `public static void registerFixesOcelot( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `@Nullable protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected float getSoundVolume()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `public EntityOcelot createChild( EntityAgeable ageable)`
- `public boolean isBreedingItem(@Nullable ItemStack stack)`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public int getTameSkin()`
- `public void setTameSkin(int skinId)`
- `public boolean getCanSpawnHere()`
- `public boolean isNotColliding()`
- `public java.lang.String getName()`
- `public void setTamed(boolean tamed)`
- `protected void setupTamedAI()`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
