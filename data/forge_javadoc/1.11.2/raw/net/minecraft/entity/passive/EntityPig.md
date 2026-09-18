---
title: "EntityPig"
description: "public class EntityPig extends EntityAnimal"
package: "net/minecraft/entity/passive"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/passive/EntityPig.html"
sourceType: javadoc
---

# EntityPig

## Class signature

```java
public class EntityPig extends EntityAnimal
```

## Constructors

- `public EntityPig( World worldIn)`

## Methods

- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `@Nullable public Entity getControllingPassenger()`
- `public boolean canBeSteered()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `protected void entityInit()`
- `public static void registerFixesPig( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `public void onDeath( DamageSource cause)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public boolean getSaddled()`
- `public void setSaddled(boolean saddled)`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
- `public void fall(float distance, float damageMultiplier)`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public boolean boost()`
- `public EntityPig createChild( EntityAgeable ageable)`
- `public boolean isBreedingItem( ItemStack stack)`
