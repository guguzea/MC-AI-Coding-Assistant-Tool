---
title: "EntityItemFrame"
description: "public class EntityItemFrame extends EntityHanging"
package: "net/minecraft/entity/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityItemFrame.html"
sourceType: javadoc
---

# EntityItemFrame

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityHanging → net.minecraft.entity.item.EntityItemFrame

## Class signature

```java
public class EntityItemFrame extends EntityHanging
```

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `void dropItemOrSelf(Entity p_146065_1_, boolean p_146065_2_)`
- `protected void entityInit()`
- `int func_174866_q()`
- `float getCollisionBorderSize()`
- `ItemStack getDisplayedItem()`
- `int getHeightPixels()`
- `int getRotation()` — Return the rotation of the item currently on this frame.
- `int getWidthPixels()`
- `boolean interactFirst(EntityPlayer playerIn)` — First layer of player interaction
- `boolean isInRangeToRenderDist(double distance)` — Checks if the entity is in range to render by using the past in distance and comparing it to its average edge length * 64 * renderDistanceWeight Args: distance
- `void onBroken(Entity brokenEntity)` — Called when this entity is broken.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setDisplayedItem(ItemStack p_82334_1_)`
- `void setItemRotation(int p_82336_1_)`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityItemFrame`
- `EntityItemFrame`
