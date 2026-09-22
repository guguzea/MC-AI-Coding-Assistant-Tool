# EntitySquid

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.passive.EntityWaterMob → net.minecraft.entity.passive.EntitySquid

## Class signature

```java
public class EntitySquid extends EntityWaterMob
```

## Constructors

- `EntitySquid(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected boolean canTriggerWalking()`
- `protected SoundEvent getAmbientSound()`
- `boolean getCanSpawnHere()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `protected float getSoundVolume()`
- `void handleStatusUpdate(byte id)`
- `boolean hasMovementVector()`
- `protected void initEntityAI()`
- `void onLivingUpdate()`
- `static void registerFixesSquid(DataFixer fixer)`
- `void setMovementVector(float randomMotionVecXIn, float randomMotionVecYIn, float randomMotionVecZIn)`
- `void travel(float strafe, float vertical, float forward)`

## Fields

- `float lastTentacleAngle`
- `float prevSquidPitch`
- `float prevSquidRotation`
- `float prevSquidYaw`
- `float squidPitch`
- `float squidRotation`
- `float squidYaw`
- `float tentacleAngle`