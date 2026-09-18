---
title: "EntityPigZombie"
description: "public class EntityPigZombie extends EntityZombie"
package: "net/minecraft/entity/monster"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/monster/EntityPigZombie.html"
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

- `public void setRevengeTarget( EntityLivingBase livingBase)`
- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `protected void updateAITasks()`
- `public boolean getCanSpawnHere()`
- `public boolean isNotColliding()`
- `public static void registerFixesPigZombie( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean isAngry()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `protected ResourceLocation getLootTable()`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `protected ItemStack getSkullDrop()`
- `public boolean isPreventingPlayerRest( EntityPlayer playerIn)`
