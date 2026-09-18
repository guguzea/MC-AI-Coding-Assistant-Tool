# EntityIronGolem

## Class signature

```java
public class EntityIronGolem extends EntityGolem
```

## Constructors

- `public EntityIronGolem( World worldIn)`

## Methods

- `protected void entityInit()`
- `protected void updateAITasks()`
- `protected void applyEntityAttributes()`
- `protected int decreaseAirSupply(int p_70682_1_)`
- `protected void collideWithEntity( Entity p_82167_1_)`
- `public void onLivingUpdate()`
- `public boolean canAttackClass(java.lang.Class<? extends EntityLivingBase > cls)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public void handleStatusUpdate(byte id)`
- `public Village getVillage()`
- `public int getAttackTimer()`
- `public void setHoldingRose(boolean p_70851_1_)`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public int getHoldRoseTick()`
- `public boolean isPlayerCreated()`
- `public void setPlayerCreated(boolean p_70849_1_)`
- `public void onDeath( DamageSource cause)`

## Description

Returns true if this entity can attack entities of the specified class.