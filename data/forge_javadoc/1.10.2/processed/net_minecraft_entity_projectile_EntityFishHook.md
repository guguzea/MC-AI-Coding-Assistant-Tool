# EntityFishHook

## Class signature

```java
public class EntityFishHook extends Entity
```

## Constructors

- `public EntityFishHook( World worldIn)`
- `public EntityFishHook( World worldIn, double x, double y, double z, EntityPlayer anglerIn)`
- `public EntityFishHook( World worldIn, EntityPlayer fishingPlayer)`

## Methods

- `protected void entityInit()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void handleHookCasting(double p_146035_1_, double p_146035_3_, double p_146035_5_, float p_146035_7_, float p_146035_8_)`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `protected boolean canBeHooked( Entity p_189739_1_)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public int handleHookRetraction()`
- `public void handleStatusUpdate(byte id)`
- `protected void bringInHookedEntity()`
- `public void setDead()`