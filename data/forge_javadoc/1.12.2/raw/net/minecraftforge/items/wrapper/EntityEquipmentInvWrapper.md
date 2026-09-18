---
title: "EntityEquipmentInvWrapper"
description: "Exposes the armor or hands inventory of an EntityLivingBase as an IItemHandler using EntityLivingBase.getItemStackFromSlot(net.minecraft.inventory.EntityEquipmentSlot) and EntityLivingBase.setItemStac"
package: "net/minecraftforge/items/wrapper"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/items/wrapper/EntityEquipmentInvWrapper.html"
sourceType: javadoc
---

# EntityEquipmentInvWrapper

## Class signature

```java
public abstract class EntityEquipmentInvWrapper extends java.lang.Object implements IItemHandlerModifiable
```

## Constructors

- `public EntityEquipmentInvWrapper( EntityLivingBase entity, EntityEquipmentSlot.Type slotType)`

## Methods

- `public int getSlots()`
- `public ItemStack getStackInSlot(int slot)`
- `public ItemStack insertItem(int slot, ItemStack stack, boolean simulate)`
- `public ItemStack extractItem(int slot, int amount, boolean simulate)`
- `public int getSlotLimit(int slot)`
- `protected int getStackLimit(int slot, ItemStack stack)`
- `public void setStackInSlot(int slot, ItemStack stack)`
- `public boolean isItemValid(int slot, ItemStack stack)`
- `protected EntityEquipmentSlot validateSlotIndex(int slot)`

## Description

Exposes the armor or hands inventory of an EntityLivingBase as an IItemHandler using EntityLivingBase.getItemStackFromSlot(net.minecraft.inventory.EntityEquipmentSlot) and EntityLivingBase.setItemStac
