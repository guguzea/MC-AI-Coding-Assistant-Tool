---
title: "EntityPigZombie"
description: "public class EntityPigZombie extends EntityZombie"
package: "net/minecraft/entity/monster"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/monster/EntityPigZombie.html"
sourceType: javadoc
---

# EntityPigZombie

## Class signature

```java
public class EntityPigZombie extends EntityZombie
```

## Constructors

- `public EntityPigZombie( World worldIn)`

## Methods

- `public void setRevengeTarget(@Nullable EntityLivingBase livingBase)`
- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `public void onUpdate()`
- `protected void updateAITasks()`
- `public boolean getCanSpawnHere()`
- `public boolean isNotColliding()`
- `public static void registerFixesPigZombie( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean isAngry()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand, @Nullable ItemStack stack)`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
