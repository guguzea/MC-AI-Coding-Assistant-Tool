---
title: "PlayerArmorInvWrapper"
description: "public class PlayerArmorInvWrapper extends InvWrapper"
package: "net/minecraftforge/items/wrapper"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/items/wrapper/PlayerArmorInvWrapper.html"
sourceType: javadoc
---

# PlayerArmorInvWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.items.wrapper.InvWrapper → net.minecraftforge.items.wrapper.PlayerArmorInvWrapper

## Class signature

```java
public class PlayerArmorInvWrapper extends InvWrapper
```

## Constructors

- `PlayerArmorInvWrapper(InventoryPlayer inv)`

## Methods

- `ItemStack extractItem(int slot, int amount, boolean simulate)` — Extracts an ItemStack from the given slot.
- `int getSlots()` — Returns the number of slots available
- `ItemStack getStackInSlot(int slot)` — Returns the ItemStack in a given slot.
- `ItemStack insertItem(int slot, ItemStack stack, boolean simulate)` — Inserts an ItemStack into the given slot and return the remainder.
- `void setStackInSlot(int slot, ItemStack stack)` — Overrides the stack in the given slot.

## Fields

- `InventoryPlayer inventoryPlayer`
- `int offset`
