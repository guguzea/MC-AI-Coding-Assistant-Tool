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
- `public AxisAlignedBB getCollisionBox( Entity entityIn)`
- `public AxisAlignedBB getCollisionBoundingBox()`
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
- `protected SoundEvent getPaddleSound()`
- `public void setPaddleState(boolean left, boolean right)`
- `public float getRowingTime(int side, float limbSwing)`
- `public float getWaterLevelAbove()`
- `public float getBoatGlide()`
- `public void updatePassenger( Entity passenger)`
- `protected void applyYawToEntity( Entity entityToUpdate)`
- `public void applyOrientationToEntity( Entity entityToUpdate)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean processInitialInteract( EntityPlayer player, EnumHand hand)`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `public boolean getPaddleState(int side)`
- `public void setDamageTaken(float damageTaken)`
- `public float getDamageTaken()`
- `public void setTimeSinceHit(int timeSinceHit)`
- `public int getTimeSinceHit()`
- `public void setForwardDirection(int forwardDirection)`
- `public int getForwardDirection()`
- `public void setBoatType( EntityBoat.Type boatType)`
- `public EntityBoat.Type getBoatType()`
- `protected boolean canFitPassenger( Entity passenger)`
- `public Entity getControllingPassenger()`
- `public void updateInputs(boolean p_184442_1_, boolean p_184442_2_, boolean p_184442_3_, boolean p_184442_4_)`
- `protected void addPassenger( Entity passenger)`