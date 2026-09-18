# EntityArmorStand

## Class signature

```java
public class EntityArmorStand extends EntityLivingBase
```

## Constructors

- `public EntityArmorStand( World worldIn)`
- `public EntityArmorStand( World worldIn, double posX, double posY, double posZ)`

## Methods

- `protected final void setSize(float width, float height)`
- `public boolean isServerWorld()`
- `protected void entityInit()`
- `public java.lang.Iterable< ItemStack > getHeldEquipment()`
- `public java.lang.Iterable< ItemStack > getArmorInventoryList()`
- `public ItemStack getItemStackFromSlot( EntityEquipmentSlot slotIn)`
- `public void setItemStackToSlot( EntityEquipmentSlot slotIn, ItemStack stack)`
- `public boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `public static void registerFixesArmorStand( DataFixer fixer)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean canBePushed()`
- `protected void collideWithEntity( Entity entityIn)`
- `protected void collideWithNearbyEntities()`
- `public EnumActionResult applyPlayerInteraction( EntityPlayer player, Vec3d vec, EnumHand hand)`
- `protected EntityEquipmentSlot getClickedSlot( Vec3d p_190772_1_)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void handleStatusUpdate(byte id)`
- `public boolean isInRangeToRenderDist(double distance)`
- `protected float updateDistance(float p_110146_1_, float p_110146_2_)`
- `public float getEyeHeight()`
- `public double getYOffset()`
- `public void travel(float strafe, float vertical, float forward)`
- `public void setRenderYawOffset(float offset)`
- `public void setRotationYawHead(float rotation)`
- `public void onUpdate()`
- `protected void updatePotionMetadata()`
- `public void setInvisible(boolean invisible)`
- `public boolean isChild()`
- `public void onKillCommand()`
- `public boolean isImmuneToExplosions()`
- `public EnumPushReaction getPushReaction()`
- `public boolean isSmall()`
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
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
- `public boolean canBeHitWithPotion()`
- `public void notifyDataManagerChange( DataParameter <?> key)`
- `public boolean attackable()`