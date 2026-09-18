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
- `public void moveTowards( BlockPos pos)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public float getBrightness(float partialTicks)`
- `public int getBrightnessForRender(float partialTicks)`
- `public boolean canBeAttackedWithItem()`