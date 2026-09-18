# EntityChicken

## Class signature

```java
public class EntityChicken extends EntityAnimal
```

## Constructors

- `public EntityChicken( World worldIn)`

## Methods

- `public float getEyeHeight()`
- `protected void applyEntityAttributes()`
- `public void onLivingUpdate()`
- `public void fall(float distance, float damageMultiplier)`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected void playStepSound( BlockPos pos, Block blockIn)`
- `protected Item getDropItem()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public EntityChicken createChild( EntityAgeable ageable)`
- `public boolean isBreedingItem( ItemStack stack)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected int getExperiencePoints( EntityPlayer player)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `protected boolean canDespawn()`
- `public void updateRiderPosition()`
- `public boolean isChickenJockey()`
- `public void setChickenJockey(boolean jockey)`

## Description

The time until the next egg is spawned.