---
title: "BehaviorProjectileDispense"
description: "Dispense the specified stack, play the dispense sound and spawn particles."
package: "net/minecraft/dispenser"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/dispenser/BehaviorProjectileDispense.html"
sourceType: javadoc
---

# BehaviorProjectileDispense

## Class signature

```java
public abstract class BehaviorProjectileDispense extends BehaviorDefaultDispenseItem
```

## Constructors

- `public BehaviorProjectileDispense()`

## Methods

- `public ItemStack dispenseStack( IBlockSource source, ItemStack stack)`
- `protected void playDispenseSound( IBlockSource source)`
- `protected abstract IProjectile getProjectileEntity( World worldIn, IPosition position)`
- `protected float func_82498_a()`
- `protected float func_82500_b()`

## Description

Dispense the specified stack, play the dispense sound and spawn particles.
