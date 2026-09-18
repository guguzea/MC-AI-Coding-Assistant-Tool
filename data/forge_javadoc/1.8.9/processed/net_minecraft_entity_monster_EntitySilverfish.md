# EntitySilverfish

## Class signature

```java
public class EntitySilverfish extends EntityMob
```

## Constructors

- `public EntitySilverfish( World worldIn)`

## Methods

- `public double getYOffset()`
- `public float getEyeHeight()`
- `protected void applyEntityAttributes()`
- `protected boolean canTriggerWalking()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected Item getDropItem()`
- `public void onUpdate()`
- `public float getBlockPathWeight( BlockPos pos)`
- `protected boolean isValidLightLevel()`
- `public boolean getCanSpawnHere()`
- `public EnumCreatureAttribute getCreatureAttribute()`

## Description

Called when the entity is attacked.