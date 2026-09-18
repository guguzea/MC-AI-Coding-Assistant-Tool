---
title: "EntityRabbit"
description: "public class EntityRabbit extends EntityAnimal"
package: "net/minecraft/entity/passive"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/passive/EntityRabbit.html"
sourceType: javadoc
---

# EntityRabbit

## Class signature

```java
public class EntityRabbit extends EntityAnimal
```

## Constructors

- `public EntityRabbit( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected float getJumpUpwardsMotion()`
- `protected void jump()`
- `public float setJumpCompletion(float p_175521_1_)`
- `public void setMovementSpeed(double newSpeed)`
- `public void setJumping(boolean jumping)`
- `public void startJumping()`
- `protected void entityInit()`
- `public void updateAITasks()`
- `public void spawnRunningParticles()`
- `public void onLivingUpdate()`
- `protected void applyEntityAttributes()`
- `public static void registerFixesRabbit( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected SoundEvent getJumpSound()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public SoundCategory getSoundCategory()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public EntityRabbit createChild( EntityAgeable ageable)`
- `public boolean isBreedingItem( ItemStack stack)`
- `public int getRabbitType()`
- `public void setRabbitType(int rabbitTypeId)`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `protected void createEatingParticles()`
- `public void handleStatusUpdate(byte id)`
