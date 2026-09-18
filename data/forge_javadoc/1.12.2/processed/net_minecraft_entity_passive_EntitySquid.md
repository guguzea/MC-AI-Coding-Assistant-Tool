# EntitySquid

## Class signature

```java
public class EntitySquid extends EntityWaterMob
```

## Constructors

- `public EntitySquid( World worldIn)`

## Methods

- `public static void registerFixesSquid( DataFixer fixer)`
- `protected void initEntityAI()`
- `protected void applyEntityAttributes()`
- `public float getEyeHeight()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `protected float getSoundVolume()`
- `protected boolean canTriggerWalking()`
- `protected ResourceLocation getLootTable()`
- `public void onLivingUpdate()`
- `public void travel(float strafe, float vertical, float forward)`
- `public boolean getCanSpawnHere()`
- `public void handleStatusUpdate(byte id)`
- `public void setMovementVector(float randomMotionVecXIn, float randomMotionVecYIn, float randomMotionVecZIn)`
- `public boolean hasMovementVector()`