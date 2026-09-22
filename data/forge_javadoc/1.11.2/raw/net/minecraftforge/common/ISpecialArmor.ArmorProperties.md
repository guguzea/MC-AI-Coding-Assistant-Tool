---
title: "ISpecialArmor.ArmorProperties"
description: "public static class ISpecialArmor.ArmorProperties extends java.lang.Object implements java.lang.Comparable<ISpecialArmor.ArmorProperties>"
package: "net/minecraftforge/common"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/ISpecialArmor.ArmorProperties.html"
sourceType: javadoc
---

# ISpecialArmor.ArmorProperties

**Inheritance:** java.lang.Object → net.minecraftforge.common.ISpecialArmor.ArmorProperties

## Class signature

```java
public static class ISpecialArmor.ArmorProperties extends java.lang.Object implements java.lang.Comparable<ISpecialArmor.ArmorProperties>
```

## Constructors

- `ArmorProperties(int priority, double ratio, int max)`

## Methods

- `static float applyArmor(EntityLivingBase entity, NonNullList<ItemStack> inventory, DamageSource source, double damage)` — Gathers and applies armor reduction to damage being dealt to a entity.
- `int compareTo(ISpecialArmor.ArmorProperties o)`
- `ISpecialArmor.ArmorProperties copy()`
- `java.lang.String toString()`

## Fields

- `int AbsorbMax`
- `double AbsorbRatio`
- `int Priority`
- `int Slot`
