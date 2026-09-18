# EntityPotion

## Class signature

```java
public class EntityPotion extends EntityThrowable
```

## Constructors

- `public EntityPotion( World worldIn)`
- `public EntityPotion( World worldIn, EntityLivingBase throwerIn, int meta)`
- `public EntityPotion( World worldIn, EntityLivingBase throwerIn, ItemStack potionDamageIn)`
- `public EntityPotion( World worldIn, double x, double y, double z, int p_i1791_8_)`
- `public EntityPotion( World worldIn, double x, double y, double z, ItemStack potionDamageIn)`

## Methods

- `protected float getGravityVelocity()`
- `protected float getVelocity()`
- `protected float getInaccuracy()`
- `public void setPotionDamage(int potionId)`
- `public int getPotionDamage()`
- `protected void onImpact( MovingObjectPosition p_70184_1_)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`

## Description

Gets the amount of gravity to apply to the thrown entity with each tick.