---
title: "EntityMagmaCube"
description: "public class EntityMagmaCube extends EntitySlime"
package: "net/minecraft/entity/monster"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityMagmaCube.html"
sourceType: javadoc
---

# EntityMagmaCube

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.monster.EntitySlime → net.minecraft.entity.monster.EntityMagmaCube

## Class signature

```java
public class EntityMagmaCube extends EntitySlime
```

## Methods

- `protected void alterSquishAmount()`
- `protected void applyEntityAttributes()`
- `protected boolean canDamagePlayer()` — Indicates weather the slime is able to damage the player (based upon the slime's size)
- `protected EntitySlime createInstance()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `void fall(float distance, float damageMultiplier)`
- `protected int getAttackStrength()` — Gets the amount of damage dealt to the player when "attacked" by the slime.
- `float getBrightness(float partialTicks)` — Gets how bright this entity is.
- `int getBrightnessForRender(float partialTicks)`
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected Item getDropItem()`
- `protected int getJumpDelay()` — Gets the amount of time the slime needs to wait between jumps.
- `protected java.lang.String getJumpSound()` — Returns the name of the sound played when the slime jumps.
- `protected EnumParticleTypes getParticleType()`
- `int getTotalArmorValue()` — Returns the current armor value as determined by a call to InventoryPlayer.getTotalArmorValue
- `protected void handleJumpLava()`
- `boolean isBurning()` — Returns true if the entity is on fire.
- `boolean isNotColliding()` — Checks that the entity is not colliding with any blocks / liquids
- `protected void jump()` — Causes this entity to do an upwards motion (jumping).
- `protected boolean makesSoundOnLand()` — Returns true if the slime makes a sound when it lands after a jump (based upon the slime's size)

## Fields

- `EntityMagmaCube`
