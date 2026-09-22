# EntityArmorStand

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.item.EntityArmorStand

## Class signature

```java
public class EntityArmorStand extends EntityLivingBase
```

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `boolean canBePushed()` — Returns true if this entity should push and be pushed by other entities when colliding.
- `protected void collideWithEntity(Entity p_82167_1_)`
- `protected void collideWithNearbyEntities()`
- `protected void entityInit()`
- `protected float func_110146_f(float p_110146_1_, float p_110146_2_)`
- `boolean func_181026_s()`
- `Rotations getBodyRotation()`
- `ItemStack getCurrentArmor(int slotIn)`
- `ItemStack getEquipmentInSlot(int slotIn)` — 0: Tool in Hand; 1-4: Armor
- `float getEyeHeight()`
- `Rotations getHeadRotation()`
- `ItemStack getHeldItem()` — Returns the item that this EntityLiving is holding, if any.
- `ItemStack [] getInventory()` — returns the inventory of this entity (only used in EntityPlayerMP it seems)
- `Rotations getLeftArmRotation()`
- `Rotations getLeftLegRotation()`
- `Rotations getRightArmRotation()`
- `Rotations getRightLegRotation()`
- `boolean getShowArms()`
- `boolean hasNoBasePlate()`
- `boolean hasNoGravity()`
- `boolean interactAt(EntityPlayer player, Vec3 targetVec3)` — New version of interactWith that includes vector information on where precisely the player targeted.
- `boolean isChild()` — If Animal, checks if the age timer is negative
- `boolean isImmuneToExplosions()`
- `boolean isInRangeToRenderDist(double distance)` — Checks if the entity is in range to render by using the past in distance and comparing it to its average edge length * 64 * renderDistanceWeight Args: distance
- `boolean isServerWorld()` — Returns whether the entity is in a server world
- `boolean isSmall()`
- `void moveEntityWithHeading(float strafe, float forward)` — Moves the entity based on the specified heading.
- `void onKillCommand()` — Called by the /kill command.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void setBodyRotation(Rotations p_175424_1_)`
- `void setCurrentItemOrArmor(int slotIn, ItemStack stack)` — Sets the held item, or an armor slot.
- `void setHeadRotation(Rotations p_175415_1_)`
- `void setInvisible(boolean invisible)`
- `void setLeftArmRotation(Rotations p_175405_1_)`
- `void setLeftLegRotation(Rotations p_175417_1_)`
- `void setRightArmRotation(Rotations p_175428_1_)`
- `void setRightLegRotation(Rotations p_175427_1_)`
- `protected void updatePotionMetadata()` — Clears potion metadata values if the entity has no potion effects.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityArmorStand`
- `EntityArmorStand`