---
title: "EntityXPOrb"
description: "public class EntityXPOrb extends Entity"
package: "net/minecraft/entity/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityXPOrb.html"
sourceType: javadoc
---

# EntityXPOrb

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.item.EntityXPOrb

## Class signature

```java
public class EntityXPOrb extends Entity
```

## Constructors

- `EntityXPOrb(World worldIn)`
- `EntityXPOrb(World worldIn, double x, double y, double z, int expValue)`

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canAttackWithItem()` — If returns false, the item will not inflict any damage against entities.
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void dealFireDamage(int amount)` — Will deal the specified amount of damage to the entity if the entity isn't immune to fire damage.
- `protected void entityInit()`
- `int getBrightnessForRender(float partialTicks)`
- `int getTextureByXP()` — Returns a number from 1 to 10 based on how much XP this orb is worth.
- `static int getXPSplit(int expValue)` — Get a fragment of the maximum experience points value for the supplied value of experience points value.
- `int getXpValue()` — Returns the XP value of this XP orb.
- `boolean handleWaterMovement()` — Returns if this entity is in water and will end up adding the waters velocity to the entity
- `void onCollideWithPlayer(EntityPlayer entityIn)` — Called by a player entity when they collide with an entity
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `int delayBeforeCanPickup`
- `int xpColor` — A constantly increasing value that RenderXPOrb uses to control the colour shifting (Green / yellow)
- `int xpOrbAge` — The age of the XP orb in ticks.
- `int xpValue` — This is how much XP this orb has.
