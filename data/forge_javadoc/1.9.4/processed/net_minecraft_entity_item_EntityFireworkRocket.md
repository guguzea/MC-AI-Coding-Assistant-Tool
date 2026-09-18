# EntityFireworkRocket

## Class signature

```java
public class EntityFireworkRocket extends Entity
```

## Constructors

- `public EntityFireworkRocket( World worldIn)`
- `public EntityFireworkRocket( World worldIn, double x, double y, double z, @Nullable ItemStack givenItem)`

## Methods

- `protected void entityInit()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `public void handleStatusUpdate(byte id)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public float getBrightness(float partialTicks)`
- `public int getBrightnessForRender(float partialTicks)`
- `public boolean canBeAttackedWithItem()`