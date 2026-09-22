---
title: "ISpecialArmor"
description: "public interface ISpecialArmor"
package: "net/minecraftforge/common"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/ISpecialArmor.html"
sourceType: javadoc
---

# ISpecialArmor

## Class signature

```java
public interface ISpecialArmor
```

## Methods

- `void damageArmor(EntityLivingBase entity, ItemStack stack, DamageSource source, int damage, int slot)` — Applies damage to the ItemStack.
- `int getArmorDisplay(EntityPlayer player, ItemStack armor, int slot)` — Get the displayed effective armor.
- `ISpecialArmor.ArmorProperties getProperties(EntityLivingBase player, ItemStack armor, DamageSource source, double damage, int slot)` — Retrieves the modifiers to be used when calculating armor damage.
- `default boolean handleUnblockableDamage(EntityLivingBase entity, ItemStack armor, DamageSource source, double damage, int slot)` — Simple check to see if the armor should interact with "Unblockable" damage sources.
