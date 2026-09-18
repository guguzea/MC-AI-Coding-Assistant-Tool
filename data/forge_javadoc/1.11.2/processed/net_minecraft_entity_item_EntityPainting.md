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

- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public int getWidthPixels()`
- `public int getHeightPixels()`
- `public void onBroken(@Nullable Entity brokenEntity)`
- `public void playPlaceSound()`
- `public void setLocationAndAngles(double x, double y, double z, float yaw, float pitch)`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`