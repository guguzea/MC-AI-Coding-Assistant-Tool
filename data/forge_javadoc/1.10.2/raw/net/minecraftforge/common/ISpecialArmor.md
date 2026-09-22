---
title: "ISpecialArmor"
description: "public interface ISpecialArmor"
package: "net/minecraftforge/common"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/ISpecialArmor.html"
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
