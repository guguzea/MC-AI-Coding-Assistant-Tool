# EntityGuardian

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityGuardian

## Class signature

```java
public class EntityGuardian extends EntityMob
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `float getAttackAnimationScale(float p_175477_1_)`
- `int getAttackDuration()`
- `float getBlockPathWeight(BlockPos pos)`
- `boolean getCanSpawnHere()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `protected PathNavigate getNewNavigator(World worldIn)`
- `float getSpikesAnimation(float p_175469_1_)`
- `float getTailAnimation(float p_175471_1_)`
- `int getTalkInterval()`
- `EntityLivingBase getTargetedEntity()`
- `int getVerticalFaceSpeed()`
- `boolean hasTargetedEntity()`
- `protected void initEntityAI()`
- `boolean isElder()`
- `boolean isMoving()`
- `boolean isNotColliding()`
- `protected boolean isValidLightLevel()`
- `void moveEntityWithHeading(float strafe, float forward)`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onLivingUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesGuardian(DataFixer fixer)`
- `void setElder()`
- `void setElder(boolean elder)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EntityGuardian`