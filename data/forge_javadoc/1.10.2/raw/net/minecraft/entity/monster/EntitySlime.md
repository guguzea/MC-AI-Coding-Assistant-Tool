---
title: "EntitySlime"
description: "Called when the slime spawns particles on landing, see onUpdate."
package: "net/minecraft/entity/monster"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/monster/EntitySlime.html"
sourceType: javadoc
---

# EntitySlime

## Class signature

```java
public class EntitySlime extends EntityLiving implements IMob
```

## Constructors

- `public EntitySlime( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void entityInit()`
- `protected void setSlimeSize(int size)`
- `public int getSlimeSize()`
- `public static void registerFixesSlime( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean isSmallSlime()`
- `protected EnumParticleTypes getParticleType()`
- `public void onUpdate()`
- `protected void alterSquishAmount()`
- `protected int getJumpDelay()`
- `protected EntitySlime createInstance()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public void setDead()`
- `public void applyEntityCollision( Entity entityIn)`
- `public void onCollideWithPlayer( EntityPlayer entityIn)`
- `protected void dealDamage( EntityLivingBase entityIn)`
- `public float getEyeHeight()`
- `protected boolean canDamagePlayer()`
- `protected int getAttackStrength()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected SoundEvent getSquishSound()`
- `protected Item getDropItem()`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean getCanSpawnHere()`
- `protected float getSoundVolume()`
- `public int getVerticalFaceSpeed()`
- `protected boolean makesSoundOnJump()`
- `protected void jump()`
- `@Nullable public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, @Nullable IEntityLivingData livingdata)`
- `protected SoundEvent getJumpSound()`
- `protected boolean spawnCustomParticles()`

## Description

Called when the slime spawns particles on landing, see onUpdate.
