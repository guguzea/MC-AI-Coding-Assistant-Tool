# EntityBoat

## Class signature

```java
public class EntityBoat extends Entity
```

## Constructors

- `public EntityBoat( World worldIn)`
- `public EntityBoat( World worldIn, double x, double y, double z)`

## Methods

- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `@Nullable public AxisAlignedBB getCollisionBox( Entity entityIn)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox()`
- `public boolean canBePushed()`
- `public double getMountedYOffset()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void applyEntityCollision( Entity entityIn)`
- `public Item getItemBoat()`
- `public void performHurtAnimation()`
- `public boolean canBeCollidedWith()`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `public EnumFacing getAdjustedHorizontalFacing()`
- `public void onUpdate()`
- `public void setPaddleState(boolean p_184445_1_, boolean p_184445_2_)`
- `public float getRowingTime(int p_184448_1_, float limbSwing)`
- `public float getWaterLevelAbove()`
- `public float getBoatGlide()`
- `public void updatePassenger( Entity passenger)`
- `protected void applyYawToEntity( Entity entityToUpdate)`
- `public void applyOrientationToEntity( Entity entityToUpdate)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean processInitialInteract( EntityPlayer player, EnumHand hand)`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `public boolean getPaddleState(int p_184457_1_)`
- `public void setDamageTaken(float damageTaken)`
- `public float getDamageTaken()`
- `public void setTimeSinceHit(int timeSinceHit)`
- `public int getTimeSinceHit()`
- `public void setForwardDirection(int forwardDirection)`
- `public int getForwardDirection()`
- `public void setBoatType( EntityBoat.Type boatType)`
- `public EntityBoat.Type getBoatType()`
- `protected boolean canFitPassenger( Entity passenger)`
- `@Nullable public Entity getControllingPassenger()`
- `public void updateInputs(boolean p_184442_1_, boolean p_184442_2_, boolean p_184442_3_, boolean p_184442_4_)`