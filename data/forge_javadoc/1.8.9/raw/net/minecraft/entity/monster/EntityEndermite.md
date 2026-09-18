---
title: "EntityEndermite"
description: "returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops"
package: "net/minecraft/entity/monster"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityEndermite.html"
sourceType: javadoc
---

# EntityEndermite

## Class signature

```java
public class EntityEndermite extends EntityMob
```

## Constructors

- `public EntityEndermite( World worldIn)`

## Methods

- `public float getEyeHeight()`
- `protected void applyEntityAttributes()`
- `protected boolean canTriggerWalking()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected Item getDropItem()`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void onUpdate()`
- `public boolean isSpawnedByPlayer()`
- `public void setSpawnedByPlayer(boolean spawnedByPlayer)`
- `public void onLivingUpdate()`
- `protected boolean isValidLightLevel()`
- `public boolean getCanSpawnHere()`
- `public EnumCreatureAttribute getCreatureAttribute()`

## Description

returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
