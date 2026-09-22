---
title: "Enchantment"
description: "public abstract class Enchantment extends java.lang.Object"
package: "net/minecraft/enchantment"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/enchantment/Enchantment.html"
sourceType: javadoc
---

# Enchantment

**Inheritance:** java.lang.Object → net.minecraft.enchantment.Enchantment

## Class signature

```java
public abstract class Enchantment extends java.lang.Object
```

## Constructors

- `Enchantment(int enchID, ResourceLocation enchName, int enchWeight, EnumEnchantmentType enchType)`

## Methods

- `static void addToBookList(Enchantment enchantment)` — Add to the list of enchantments applicable by the anvil from a book
- `float calcDamageByCreature(int level, EnumCreatureAttribute creatureType)` — Calculates the additional damage that will be dealt by an item with this enchantment.
- `int calcModifierDamage(int level, DamageSource source)` — Calculates the damage protection of the enchantment based on level and damage source passed.
- `boolean canApply(ItemStack stack)` — Determines if this enchantment can be applied to a specific ItemStack.
- `boolean canApplyAtEnchantingTable(ItemStack stack)` — This applies specifically to applying at the enchanting table.
- `boolean canApplyTogether(Enchantment ench)` — Determines if the enchantment passed can be applyied together with this enchantment.
- `static java.util.Set<ResourceLocation> func_181077_c()`
- `static Enchantment getEnchantmentById(int enchID)` — Retrieves an Enchantment from the enchantmentsList
- `static Enchantment getEnchantmentByLocation(java.lang.String location)` — Retrieves an enchantment by using its location name.
- `int getMaxEnchantability(int enchantmentLevel)` — Returns the maximum value of enchantability nedded on the enchantment level passed.
- `int getMaxLevel()` — Returns the maximum level that the enchantment can have.
- `int getMinEnchantability(int enchantmentLevel)` — Returns the minimal value of enchantability needed on the enchantment level passed.
- `int getMinLevel()` — Returns the minimum level that the enchantment can have.
- `java.lang.String getName()` — Return the name of key in translation table of this enchantment.
- `java.lang.String getTranslatedName(int level)` — Returns the correct traslated name of the enchantment and the level in roman numbers.
- `int getWeight()` — Retrieves the weight value of an Enchantment.
- `boolean isAllowedOnBooks()` — Is this enchantment allowed to be enchanted on books via Enchantment Table
- `void onEntityDamaged(EntityLivingBase user, Entity target, int level)` — Called whenever a mob is damaged with an item that has this enchantment on it.
- `void onUserHurt(EntityLivingBase user, Entity attacker, int level)` — Whenever an entity that has this enchantment on one of its associated items is damaged this method will be called.
- `Enchantment setName(java.lang.String enchName)` — Sets the enchantment name

## Fields

- `static Enchantment aquaAffinity` — Increases underwater mining rate
- `static Enchantment baneOfArthropods`
- `static Enchantment blastProtection` — Protection against explosions
- `static Enchantment depthStrider`
- `int effectId`
- `static Enchantment efficiency` — Faster resource gathering while in use
- `static Enchantment [] enchantmentsBookList`
- `static Enchantment featherFalling`
- `static Enchantment fireAspect` — Lights mobs on fire
- `static Enchantment fireProtection` — Protection against fire
- `static Enchantment flame` — Flame enchantment for bows.
- `static Enchantment fortune` — Can multiply the drop rate of items from blocks
- `static Enchantment infinity` — Infinity enchantment for bows.
- `static Enchantment knockback`
- `static Enchantment looting` — Mobs have a chance to drop more loot
- `static Enchantment luckOfTheSea`
- `static Enchantment lure`
- `protected java.lang.String name` — Used in localisation and stats.
- `static Enchantment power` — Power enchantment for bows, add's extra damage to arrows.
- `static Enchantment projectileProtection`
- `static Enchantment protection`
- `static Enchantment punch` — Knockback enchantments for bows, the arrows will knockback the target when hit.
- `static Enchantment respiration`
- `static Enchantment sharpness`
- `static Enchantment silkTouch` — Blocks mined will drop themselves, even if it should drop something else (e.g. stone will drop stone, not cobblestone)
- `static Enchantment smite`
- `static Enchantment thorns`
- `EnumEnchantmentType type` — The EnumEnchantmentType given to this Enchantment.
- `static Enchantment unbreaking` — Sometimes, the tool's durability will not be spent when the tool is used
