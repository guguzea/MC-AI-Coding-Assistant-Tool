# EntityEnderEye

## Class signature

```java
public class EntityEnderEye extends Entity
```

## Constructors

- `public EntityEnderEye( World worldIn)`
- `public EntityEnderEye( World worldIn, double x, double y, double z)`

## Methods

- `protected void entityInit()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void moveTowards( BlockPos p_180465_1_)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public float getBrightness(float partialTicks)`
- `public int getBrightnessForRender(float partialTicks)`
- `public boolean canAttackWithItem()`

## Description

If returns false, the item will not inflict any damage against entities.