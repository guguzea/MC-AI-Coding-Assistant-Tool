# EntityTameable

## Class signature

```java
public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable
```

## Constructors

- `public EntityTameable( World worldIn)`

## Methods

- `protected void entityInit()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected void playTameEffect(boolean play)`
- `public void handleStatusUpdate(byte id)`
- `public boolean isTamed()`
- `public void setTamed(boolean tamed)`
- `protected void setupTamedAI()`
- `public boolean isSitting()`
- `public void setSitting(boolean sitting)`
- `public java.lang.String getOwnerId()`
- `public void setOwnerId(java.lang.String ownerUuid)`
- `public EntityLivingBase getOwner()`
- `public boolean isOwner( EntityLivingBase entityIn)`
- `public EntityAISit getAISit()`
- `public boolean shouldAttackEntity( EntityLivingBase p_142018_1_, EntityLivingBase p_142018_2_)`
- `public Team getTeam()`
- `public boolean isOnSameTeam( EntityLivingBase otherEntity)`
- `public void onDeath( DamageSource cause)`

## Description

Returns the AITask responsible of the sit logic