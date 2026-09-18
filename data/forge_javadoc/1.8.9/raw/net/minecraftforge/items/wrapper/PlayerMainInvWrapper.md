---
title: "PlayerMainInvWrapper"
description: "Exposes the player inventory WITHOUT the armor inventory as IItemHandler. Also takes core of inserting/extracting having the same logic as picking up items."
package: "net/minecraftforge/items/wrapper"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/items/wrapper/PlayerMainInvWrapper.html"
sourceType: javadoc
---

# PlayerMainInvWrapper

## Class signature

```java
public class PlayerMainInvWrapper extends InvWrapper
```

## Constructors

- `public PlayerMainInvWrapper( InventoryPlayer inv)`

## Methods

- `public int getSlots()`
- `public void setStackInSlot(int slot, ItemStack stack)`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`

## Description

Exposes the player inventory WITHOUT the armor inventory as IItemHandler. Also takes core of inserting/extracting having the same logic as picking up items.
