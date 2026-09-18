---
title: "EntityArmorStand"
description: "Called when the entity is attacked."
package: "net/minecraft/entity/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityArmorStand.html"
sourceType: javadoc
---

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
- `public ItemStack getHeldItem()`
- `public ItemStack getEquipmentInSlot(int slotIn)`
- `public ItemStack getCurrentArmor(int slotIn)`
- `public void setCurrentItemOrArmor(int slotIn, ItemStack stack)`
- `public ItemStack [] getInventory()`
- `public boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean canBePushed()`
- `protected void collideWithEntity( Entity p_82167_1_)`
- `protected void collideWithNearbyEntities()`
- `public boolean interactAt( EntityPlayer player, Vec3 targetVec3)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean isInRangeToRenderDist(double distance)`
- `protected float func_110146_f(float p_110146_1_, float p_110146_2_)`
- `public float getEyeHeight()`
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
- `public boolean func_181026_s()`
- `public void setHeadRotation( Rotations p_175415_1_)`
- `public void setBodyRotation( Rotations p_175424_1_)`
- `public void setLeftArmRotation( Rotations p_175405_1_)`
- `public void setRightArmRotation( Rotations p_175428_1_)`
- `public void setLeftLegRotation( Rotations p_175417_1_)`
- `public void setRightLegRotation( Rotations p_175427_1_)`
- `public Rotations getHeadRotation()`
- `public Rotations getBodyRotation()`
- `public Rotations getLeftArmRotation()`
- `public Rotations getRightArmRotation()`
- `public Rotations getLeftLegRotation()`
- `public Rotations getRightLegRotation()`
- `public boolean canBeCollidedWith()`

## Description

Called when the entity is attacked.
