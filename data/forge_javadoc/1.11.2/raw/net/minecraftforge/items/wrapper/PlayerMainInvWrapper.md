---
title: "PlayerMainInvWrapper"
description: "Exposes the player inventory WITHOUT the armor inventory as IItemHandler. Also takes core of inserting/extracting having the same logic as picking up items."
package: "net/minecraftforge/items/wrapper"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/items/wrapper/PlayerMainInvWrapper.html"
sourceType: javadoc
---

# PlayerMainInvWrapper

## Class signature

```java
public class PlayerMainInvWrapper extends RangedWrapper
```

## Constructors

- `public PlayerMainInvWrapper( InventoryPlayer inv)`

## Methods

- `@Nonnull public ItemStack insertItem(int slot, @Nonnull ItemStack stack, boolean simulate)`
- `public InventoryPlayer getInventoryPlayer()`

## Description

Exposes the player inventory WITHOUT the armor inventory as IItemHandler. Also takes core of inserting/extracting having the same logic as picking up items.
