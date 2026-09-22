# EntityGuardian

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityGuardian

## Class signature

```java
public class EntityGuardian extends EntityMob
```

## Constructors

- `EntityGuardian(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `protected boolean canTriggerWalking()`
- `protected PathNavigate createNavigator(World worldIn)`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `float getAttackAnimationScale(float p_175477_1_)`
- `int getAttackDuration()`
- `float getBlockPathWeight(BlockPos pos)`
- `boolean getCanSpawnHere()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getFlopSound()`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `protected ResourceLocation getLootTable()`
- `float getSpikesAnimation(float p_175469_1_)`
- `float getTailAnimation(float p_175471_1_)`
- `int getTalkInterval()`
- `EntityLivingBase getTargetedEntity()`
- `int getVerticalFaceSpeed()`
- `boolean hasTargetedEntity()`
- `protected void initEntityAI()`
- `boolean isMoving()`
- `boolean isNotColliding()`
- `protected boolean isValidLightLevel()`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onLivingUpdate()`
- `static void registerFixesGuardian(DataFixer fixer)`
- `void travel(float strafe, float vertical, float forward)`

## Fields

- `protected float clientSideSpikesAnimation`
- `protected float clientSideSpikesAnimationO`
- `protected float clientSideTailAnimation`
- `protected float clientSideTailAnimationO`
- `protected float clientSideTailAnimationSpeed`
- `protected EntityAIWander wander`