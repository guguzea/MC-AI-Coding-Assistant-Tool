# EntityArmorStand

## Class signature

```java
public class EntityArmorStand extends EntityLivingBase
```

## Constructors

- `public EntityArmorStand( World worldIn)`
- `public EntityArmorStand( World worldIn, double posX, double posY, double posZ)`

## Methods

- `public boolean isServerWorld()`
- `protected void entityInit()`
- `public java.lang.Iterable< ItemStack > getHeldEquipment()`
- `public java.lang.Iterable< ItemStack > getArmorInventoryList()`
- `@Nullable public ItemStack getItemStackFromSlot( EntityEquipmentSlot slotIn)`
- `public void setItemStackToSlot( EntityEquipmentSlot slotIn, @Nullable ItemStack stack)`
- `public boolean replaceItemInInventory(int inventorySlot, @Nullable ItemStack itemStackIn)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean canBePushed()`
- `protected void collideWithEntity( Entity entityIn)`
- `protected void collideWithNearbyEntities()`
- `public EnumActionResult applyPlayerInteraction( EntityPlayer player, Vec3d vec, @Nullable ItemStack stack, EnumHand hand)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void handleStatusUpdate(byte id)`
- `public boolean isInRangeToRenderDist(double distance)`
- `protected float updateDistance(float p_110146_1_, float p_110146_2_)`
- `public float getEyeHeight()`
- `public double getYOffset()`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public void onUpdate()`
- `protected void updatePotionMetadata()`
- `public void setInvisible(boolean invisible)`
- `public boolean isChild()`
- `public void onKillCommand()`
- `public boolean isImmuneToExplosions()`
- `public boolean isSmall()`
- `public boolean hasNoGravity()`
- `public boolean getShowArms()`
- `public boolean hasNoBasePlate()`
- `public boolean hasMarker()`
- `public void setHeadRotation( Rotations vec)`
- `public void setBodyRotation( Rotations vec)`
- `public void setLeftArmRotation( Rotations vec)`
- `public void setRightArmRotation( Rotations vec)`
- `public void setLeftLegRotation( Rotations vec)`
- `public void setRightLegRotation( Rotations vec)`
- `public Rotations getHeadRotation()`
- `public Rotations getBodyRotation()`
- `public Rotations getLeftArmRotation()`
- `public Rotations getRightArmRotation()`
- `public Rotations getLeftLegRotation()`
- `public Rotations getRightLegRotation()`
- `public boolean canBeCollidedWith()`
- `public EnumHandSide getPrimaryHand()`
- `protected SoundEvent getFallSound(int heightIn)`
- `@Nullable protected SoundEvent getHurtSound()`
- `@Nullable protected SoundEvent getDeathSound()`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
- `public boolean canBeHitWithPotion()`