# EntitySlime

## Class signature

```java
public class EntitySlime extends EntityLiving implements IMob
```

## Constructors

- `public EntitySlime( World worldIn)`

## Methods

- `protected void entityInit()`
- `protected void setSlimeSize(int size)`
- `public int getSlimeSize()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected EnumParticleTypes getParticleType()`
- `protected java.lang.String getJumpSound()`
- `public void onUpdate()`
- `protected void alterSquishAmount()`
- `protected int getJumpDelay()`
- `protected EntitySlime createInstance()`
- `public void onDataWatcherUpdate(int dataID)`
- `public void setDead()`
- `public void applyEntityCollision( Entity entityIn)`
- `public void onCollideWithPlayer( EntityPlayer entityIn)`
- `protected void func_175451_e( EntityLivingBase p_175451_1_)`
- `public float getEyeHeight()`
- `protected boolean canDamagePlayer()`
- `protected int getAttackStrength()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected Item getDropItem()`
- `public boolean getCanSpawnHere()`
- `protected float getSoundVolume()`
- `public int getVerticalFaceSpeed()`
- `protected boolean makesSoundOnJump()`
- `protected boolean makesSoundOnLand()`
- `protected void jump()`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`
- `protected boolean spawnCustomParticles()`

## Description

Applies a velocity to each of the entities pushing them away from each other.