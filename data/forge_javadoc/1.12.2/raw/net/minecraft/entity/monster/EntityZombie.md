---
title: "EntityZombie"
description: "public class EntityZombie extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/monster/EntityZombie.html"
sourceType: javadoc
---

# EntityZombie

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityZombie

## Class signature

```java
public class EntityZombie extends EntityMob
```

## Constructors

- `EntityZombie(World worldIn)`

## Methods

- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `protected boolean canEquipItem(ItemStack stack)`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `EnumCreatureAttribute getCreatureAttribute()`
- `protected SoundEvent getDeathSound()`
- `protected int getExperiencePoints(EntityPlayer player)`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `protected ItemStack getSkullDrop()`
- `protected SoundEvent getStepSound()`
- `double getYOffset()`
- `protected void initEntityAI()`
- `boolean isArmsRaised()`
- `boolean isBreakDoorsTaskSet()`
- `boolean isChild()`
- `protected void multiplySize(float size)`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onDeath(DamageSource cause)`
- `IEntityLivingData onInitialSpawn(DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `void onKillEntity(EntityLivingBase entityLivingIn)`
- `void onLivingUpdate()`
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesZombie(DataFixer fixer)`
- `void setArmsRaised(boolean armsRaised)`
- `void setBreakDoorsAItask(boolean enabled)`
- `void setChild(boolean childZombie)`
- `void setChildSize(boolean isChild)`
- `protected void setEquipmentBasedOnDifficulty(DifficultyInstance difficulty)`
- `protected void setSize(float width, float height)`
- `protected boolean shouldBurnInDay()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected static IAttribute SPAWN_REINFORCEMENTS_CHANCE`
