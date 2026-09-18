---
title: "BehaviorDefaultDispenseItem"
description: "Dispenses the specified ItemStack from a dispenser."
package: "net/minecraft/dispenser"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/dispenser/BehaviorDefaultDispenseItem.html"
sourceType: javadoc
---

# BehaviorDefaultDispenseItem

## Class signature

```java
public class BehaviorDefaultDispenseItem extends java.lang.Object implements IBehaviorDispenseItem
```

## Constructors

- `public BehaviorDefaultDispenseItem()`

## Methods

- `public final ItemStack dispense( IBlockSource source, ItemStack stack)`
- `protected ItemStack dispenseStack( IBlockSource source, ItemStack stack)`
- `public static void doDispense( World worldIn, ItemStack stack, int speed, EnumFacing facing, IPosition position)`
- `protected void playDispenseSound( IBlockSource source)`
- `protected void spawnDispenseParticles( IBlockSource source, EnumFacing facingIn)`

## Description

Dispenses the specified ItemStack from a dispenser.
