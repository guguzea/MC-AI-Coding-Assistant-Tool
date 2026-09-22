---
title: "EntityItem"
description: "public class EntityItem extends Entity"
package: "net/minecraft/entity/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityItem.html"
sourceType: javadoc
---

# EntityItem

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityItem

## Class signature

```java
public class EntityItem extends Entity
```

## Constructors

- `EntityItem(World worldIn)`
- `EntityItem(World worldIn, double x, double y, double z)`
- `EntityItem(World worldIn, double x, double y, double z, ItemStack stack)`

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canAttackWithItem()` — If returns false, the item will not inflict any damage against entities.
- `boolean cannotPickup()`
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void dealFireDamage(int amount)` — Will deal the specified amount of damage to the entity if the entity isn't immune to fire damage.
- `protected void entityInit()`
- `void func_174870_v()`
- `int getAge()`
- `ItemStack getEntityItem()` — Returns the ItemStack corresponding to the Entity (Note: if no item exists, will log an error but still return an ItemStack containing Block.stone)
- `java.lang.String getName()` — Get the name of this object.
- `java.lang.String getOwner()`
- `java.lang.String getThrower()`
- `boolean handleWaterMovement()` — Returns if this entity is in water and will end up adding the waters velocity to the entity
- `void onCollideWithPlayer(EntityPlayer entityIn)` — Called by a player entity when they collide with an entity
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setAgeToCreativeDespawnTime()` — sets the age of the item so that it'll despawn one minute after it has been dropped (instead of five).
- `void setDefaultPickupDelay()`
- `void setEntityItemStack(ItemStack stack)` — Sets the ItemStack for this entity
- `void setInfinitePickupDelay()`
- `void setNoDespawn()`
- `void setNoPickupDelay()`
- `void setOwner(java.lang.String owner)`
- `void setPickupDelay(int ticks)`
- `void setThrower(java.lang.String thrower)`
- `void travelToDimension(int dimensionId)` — Teleports the entity to another dimension.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `float hoverStart` — The EntityItem's random initial float height.
- `int lifespan` — The maximum age of this EntityItem.
