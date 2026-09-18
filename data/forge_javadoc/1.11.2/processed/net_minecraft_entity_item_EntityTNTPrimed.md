# EntityTNTPrimed

## Class signature

```java
public class EntityTNTPrimed extends Entity
```

## Constructors

- `public EntityTNTPrimed( World worldIn)`
- `public EntityTNTPrimed( World worldIn, double x, double y, double z, EntityLivingBase igniter)`

## Methods

- `protected void entityInit()`
- `protected boolean canTriggerWalking()`
- `public boolean canBeCollidedWith()`
- `public void onUpdate()`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `@Nullable public EntityLivingBase getTntPlacedBy()`
- `public float getEyeHeight()`
- `public void setFuse(int fuseIn)`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public int getFuseDataManager()`
- `public int getFuse()`