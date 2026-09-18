---
title: "EntityIronGolem"
description: "public class EntityIronGolem extends EntityGolem"
package: "net/minecraft/entity/monster"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/monster/EntityIronGolem.html"
sourceType: javadoc
---

# EntityIronGolem

## Class signature

```java
public class EntityIronGolem extends EntityGolem
```

## Constructors

- `public EntityIronGolem( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void entityInit()`
- `protected void updateAITasks()`
- `protected void applyEntityAttributes()`
- `protected int decreaseAirSupply(int air)`
- `protected void collideWithEntity( Entity entityIn)`
- `public void onLivingUpdate()`
- `public boolean canAttackClass(java.lang.Class<? extends EntityLivingBase > cls)`
- `public static void registerFixesIronGolem( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public void handleStatusUpdate(byte id)`
- `public Village getVillage()`
- `public int getAttackTimer()`
- `public void setHoldingRose(boolean p_70851_1_)`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public int getHoldRoseTick()`
- `public boolean isPlayerCreated()`
- `public void setPlayerCreated(boolean playerCreated)`
- `public void onDeath( DamageSource cause)`
