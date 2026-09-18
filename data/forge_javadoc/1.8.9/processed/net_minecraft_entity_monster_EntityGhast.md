# EntityGhast

## Class signature

```java
public class EntityGhast extends EntityFlying implements IMob
```

## Constructors

- `public EntityGhast( World worldIn)`

## Methods

- `public boolean isAttacking()`
- `public void setAttacking(boolean p_175454_1_)`
- `public int getFireballStrength()`
- `public void onUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void entityInit()`
- `protected void applyEntityAttributes()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected Item getDropItem()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `protected float getSoundVolume()`
- `public boolean getCanSpawnHere()`
- `public int getMaxSpawnedInChunk()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public float getEyeHeight()`

## Description

Called when the entity is attacked.