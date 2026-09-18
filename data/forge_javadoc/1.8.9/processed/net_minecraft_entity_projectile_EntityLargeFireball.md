# EntityLargeFireball

## Class signature

```java
public class EntityLargeFireball extends EntityFireball
```

## Constructors

- `public EntityLargeFireball( World worldIn)`
- `public EntityLargeFireball( World worldIn, double x, double y, double z, double accelX, double accelY, double accelZ)`
- `public EntityLargeFireball( World worldIn, EntityLivingBase shooter, double accelX, double accelY, double accelZ)`

## Methods

- `protected void onImpact( MovingObjectPosition movingObject)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`

## Description

Called when this EntityFireball hits a block or entity.