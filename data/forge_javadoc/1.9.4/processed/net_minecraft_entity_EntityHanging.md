# EntityHanging

## Class signature

```java
public abstract class EntityHanging extends Entity
```

## Constructors

- `public EntityHanging( World worldIn)`
- `public EntityHanging( World worldIn, BlockPos hangingPositionIn)`

## Methods

- `protected void entityInit()`
- `protected void updateFacingWithBoundingBox( EnumFacing facingDirectionIn)`
- `protected void updateBoundingBox()`
- `public void onUpdate()`
- `public boolean onValidSurface()`
- `public boolean canBeCollidedWith()`
- `public boolean hitByEntity( Entity entityIn)`
- `public EnumFacing getHorizontalFacing()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void moveEntity(double x, double y, double z)`
- `public void addVelocity(double x, double y, double z)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public abstract int getWidthPixels()`
- `public abstract int getHeightPixels()`
- `public abstract void onBroken(@Nullable Entity brokenEntity)`
- `public abstract void playPlaceSound()`
- `public EntityItem entityDropItem( ItemStack stack, float offsetY)`
- `protected boolean shouldSetPosAfterLoading()`
- `public void setPosition(double x, double y, double z)`
- `public BlockPos getHangingPosition()`
- `public float getRotatedYaw( Rotation transformRotation)`
- `public float getMirroredYaw( Mirror transformMirror)`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`