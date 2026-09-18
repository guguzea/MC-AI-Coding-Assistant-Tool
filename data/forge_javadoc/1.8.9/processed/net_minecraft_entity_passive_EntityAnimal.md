# EntityAnimal

## Class signature

```java
public abstract class EntityAnimal extends EntityAgeable implements IAnimals
```

## Constructors

- `public EntityAnimal( World worldIn)`

## Methods

- `protected void updateAITasks()`
- `public void onLivingUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public float getBlockPathWeight( BlockPos pos)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean getCanSpawnHere()`
- `public int getTalkInterval()`
- `protected boolean canDespawn()`
- `protected int getExperiencePoints( EntityPlayer player)`
- `public boolean isBreedingItem( ItemStack stack)`
- `public boolean interact( EntityPlayer player)`
- `protected void consumeItemFromStack( EntityPlayer player, ItemStack stack)`
- `public void setInLove( EntityPlayer player)`
- `public EntityPlayer getPlayerInLove()`
- `public boolean isInLove()`
- `public void resetInLove()`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public void handleStatusUpdate(byte id)`

## Description

Called when the entity is attacked.