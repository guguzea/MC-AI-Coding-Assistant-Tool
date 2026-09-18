# EntityPainting

## Class signature

```java
public class EntityPainting extends EntityHanging
```

## Constructors

- `public EntityPainting( World worldIn)`
- `public EntityPainting( World worldIn, BlockPos pos, EnumFacing facing)`
- `public EntityPainting( World worldIn, BlockPos pos, EnumFacing facing, java.lang.String title)`

## Methods

- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public int getWidthPixels()`
- `public int getHeightPixels()`
- `public void onBroken( Entity brokenEntity)`
- `public void setLocationAndAngles(double x, double y, double z, float yaw, float pitch)`
- `public void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`

## Description

Called when this entity is broken.