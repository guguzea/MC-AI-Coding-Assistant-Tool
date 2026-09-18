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

- `public static java.util.List< WeightedRandomFishable > func_174855_j()`
- `protected void entityInit()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void handleHookCasting(double p_146035_1_, double p_146035_3_, double p_146035_5_, float p_146035_7_, float p_146035_8_)`
- `public void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public int handleHookRetraction()`
- `public void setDead()`

## Description

Checks if the entity is in range to render by using the past in distance and comparing it to its average edge length * 64 * renderDistanceWeight Args: distance