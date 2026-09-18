---
title: "ServerSelectionList"
description: "Gets the IGuiListEntry object for the given index"
package: "net/minecraft/client/gui"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/ServerSelectionList.html"
sourceType: javadoc
---

# ServerSelectionList

## Class signature

```java
public class ServerSelectionList extends GuiListExtended
```

## Constructors

- `public ServerSelectionList( GuiMultiplayer ownerIn, Minecraft mcIn, int widthIn, int heightIn, int topIn, int bottomIn, int slotHeightIn)`

## Methods

- `public GuiListExtended.IGuiListEntry getListEntry(int index)`
- `protected int getSize()`
- `public void setSelectedSlotIndex(int selectedSlotIndexIn)`
- `protected boolean isSelected(int slotIndex)`
- `public int func_148193_k()`
- `public void func_148195_a( ServerList p_148195_1_)`
- `public void func_148194_a(java.util.List< LanServerDetector.LanServer > p_148194_1_)`
- `protected int getScrollBarX()`
- `public int getListWidth()`

## Description

Gets the IGuiListEntry object for the given index
