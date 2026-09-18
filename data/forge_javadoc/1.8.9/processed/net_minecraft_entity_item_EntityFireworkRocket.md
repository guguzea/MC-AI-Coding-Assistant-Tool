# EntityFireworkRocket

## Class signature

```java
public class EntityFireworkRocket extends Entity
```

## Constructors

- `public EntityFireworkRocket( World worldIn)`
- `public EntityFireworkRocket( World worldIn, double x, double y, double z, ItemStack givenItem)`

## Methods

- `protected void entityInit()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `public void handleStatusUpdate(byte id)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public float getBrightness(float partialTicks)`
- `public int getBrightnessForRender(float partialTicks)`
- `public boolean canAttackWithItem()`

## Description

If returns false, the item will not inflict any damage against entities.