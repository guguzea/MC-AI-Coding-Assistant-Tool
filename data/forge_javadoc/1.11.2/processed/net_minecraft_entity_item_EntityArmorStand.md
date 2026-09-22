# EntityArmorStand

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.item.EntityArmorStand

## Class signature

```java
public class EntityArmorStand extends EntityLivingBase
```

## Constructors

- `EntityArmorStand(World worldIn)`
- `EntityArmorStand(World worldIn, double posX, double posY, double posZ)`

## Methods

- `EnumActionResult applyPlayerInteraction(EntityPlayer player, Vec3d vec, EnumHand stack)`
- `boolean attackable()`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeCollidedWith()`
- `boolean canBeHitWithPotion()`
- `boolean canBePushed()`
- `protected void collideWithEntity(Entity entityIn)`
- `protected void collideWithNearbyEntities()`
- `protected void entityInit()`
- `java.lang.Iterable<ItemStack> getArmorInventoryList()`
- `Rotations getBodyRotation()`
- `protected EntityEquipmentSlot getClickedSlot(Vec3d p_190772_1_)`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getFallSound(int heightIn)`
- `Rotations getHeadRotation()`
- `java.lang.Iterable<ItemStack> getHeldEquipment()`
- `protected SoundEvent getHurtSound()`
- `ItemStack getItemStackFromSlot(EntityEquipmentSlot slotIn)`
- `Rotations getLeftArmRotation()`
- `Rotations getLeftLegRotation()`
- `EnumHandSide getPrimaryHand()`
- `EnumPushReaction getPushReaction()`
- `Rotations getRightArmRotation()`
- `Rotations getRightLegRotation()`
- `boolean getShowArms()`
- `double getYOffset()`
- `void handleStatusUpdate(byte id)`
- `boolean hasMarker()`
- `boolean hasNoBasePlate()`
- `boolean isChild()`
- `boolean isImmuneToExplosions()`
- `boolean isInRangeToRenderDist(double distance)`
- `boolean isServerWorld()`
- `boolean isSmall()`
- `void moveEntityWithHeading(float strafe, float forward)`
- `void notifyDataManagerChange(DataParameter<?> key)`
- `void onKillCommand()`
- `void onStruckByLightning(EntityLightningBolt lightningBolt)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesArmorStand(DataFixer fixer)`
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void setBodyRotation(Rotations vec)`
- `void setHeadRotation(Rotations vec)`
- `void setInvisible(boolean invisible)`
- `void setItemStackToSlot(EntityEquipmentSlot slotIn, ItemStack stack)`
- `void setLeftArmRotation(Rotations vec)`
- `void setLeftLegRotation(Rotations vec)`
- `void setRenderYawOffset(float offset)`
- `void setRightArmRotation(Rotations vec)`
- `void setRightLegRotation(Rotations vec)`
- `void setRotationYawHead(float rotation)`
- `protected void setSize(float width, float height)`
- `protected float updateDistance(float p_110146_1_, float p_110146_2_)`
- `protected void updatePotionMetadata()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `static DataParameter<Rotations> BODY_ROTATION`
- `static DataParameter<Rotations> HEAD_ROTATION`
- `static DataParameter<Rotations> LEFT_ARM_ROTATION`
- `static DataParameter<Rotations> LEFT_LEG_ROTATION`
- `long punchCooldown`
- `static DataParameter<Rotations> RIGHT_ARM_ROTATION`
- `static DataParameter<Rotations> RIGHT_LEG_ROTATION`
- `static DataParameter<java.lang.Byte> STATUS`