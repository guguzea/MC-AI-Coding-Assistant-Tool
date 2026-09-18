# EntityGuardian

## Class signature

```java
public class EntityGuardian extends EntityMob
```

## Constructors

- `public EntityGuardian( World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `protected PathNavigate getNewNavigator( World worldIn)`
- `protected void entityInit()`
- `public boolean func_175472_n()`
- `public int func_175464_ck()`
- `public boolean isElder()`
- `public void setElder(boolean elder)`
- `public void setElder()`
- `public boolean hasTargetedEntity()`
- `public EntityLivingBase getTargetedEntity()`
- `public void onDataWatcherUpdate(int dataID)`
- `public int getTalkInterval()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected boolean canTriggerWalking()`
- `public float getEyeHeight()`
- `public float getBlockPathWeight( BlockPos pos)`
- `public void onLivingUpdate()`
- `public float func_175471_a(float p_175471_1_)`
- `public float func_175469_o(float p_175469_1_)`
- `public float func_175477_p(float p_175477_1_)`
- `protected void updateAITasks()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `protected void addRandomDrop()`
- `protected boolean isValidLightLevel()`
- `public boolean isNotColliding()`
- `public boolean getCanSpawnHere()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public int getVerticalFaceSpeed()`
- `public void moveEntityWithHeading(float strafe, float forward)`

## Description

Causes this Entity to drop a random item.