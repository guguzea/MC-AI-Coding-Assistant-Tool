---
title: "ISpecialArmor"
description: "This interface is to be implemented by ItemArmor classes. It will allow to modify computation of damage and health loss. Computation will be called before the actual armor computation, which can then "
package: "net/minecraftforge/common"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/ISpecialArmor.html"
sourceType: javadoc
---

# ISpecialArmor

## Class signature

```java
public interface ISpecialArmor
```

## Methods

- `ISpecialArmor.ArmorProperties getProperties( EntityLivingBase player, ItemStack armor, DamageSource source, double damage, int slot)`
- `int getArmorDisplay( EntityPlayer player, ItemStack armor, int slot)`
- `void damageArmor( EntityLivingBase entity, ItemStack stack, DamageSource source, int damage, int slot)`

## Description

This interface is to be implemented by ItemArmor classes. It will allow to modify computation of damage and health loss. Computation will be called before the actual armor computation, which can then 
