---
title: "BehaviorProjectileDispense"
description: "public abstract class BehaviorProjectileDispense extends BehaviorDefaultDispenseItem"
package: "net/minecraft/dispenser"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/dispenser/BehaviorProjectileDispense.html"
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
- `protected abstract IProjectile getProjectileEntity( World worldIn, IPosition position, ItemStack stackIn)`
- `protected float getProjectileInaccuracy()`
- `protected float getProjectileVelocity()`
