---
title: "EntityArmorStand"
description: "public class EntityArmorStand extends EntityLivingBase"
package: "net/minecraft/entity/item"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/item/EntityArmorStand.html"
sourceType: javadoc
---

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

- `EnumActionResult applyPlayerInteraction(EntityPlayer player, Vec3d vec, ItemStack stack, EnumHand hand)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeCollidedWith()`
- `boolean canBeHitWithPotion()`
- `boolean canBePushed()`
- `protected void collideWithEntity(Entity entityIn)`
- `protected void collideWithNearbyEntities()`
- `protected void entityInit()`
- `java.lang.Iterable<ItemStack> getArmorInventoryList()`
- `Rotations getBodyRotation()`
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
- `Rotations getRightArmRotation()`
- `Rotations getRightLegRotation()`
- `boolean getShowArms()`
- `double getYOffset()`
- `void handleStatusUpdate(byte id)`
- `boolean hasMarker()`
- `boolean hasNoBasePlate()`
- `boolean hasNoGravity()`
- `boolean isChild()`
- `boolean isImmuneToExplosions()`
- `boolean isInRangeToRenderDist(double distance)`
- `boolean isServerWorld()`
- `boolean isSmall()`
- `void moveEntityWithHeading(float strafe, float forward)`
- `void onKillCommand()`
- `void onStruckByLightning(EntityLightningBolt lightningBolt)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void setBodyRotation(Rotations vec)`
- `void setHeadRotation(Rotations vec)`
- `void setInvisible(boolean invisible)`
- `void setItemStackToSlot(EntityEquipmentSlot slotIn, ItemStack stack)`
- `void setLeftArmRotation(Rotations vec)`
- `void setLeftLegRotation(Rotations vec)`
- `void setRightArmRotation(Rotations vec)`
- `void setRightLegRotation(Rotations vec)`
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
