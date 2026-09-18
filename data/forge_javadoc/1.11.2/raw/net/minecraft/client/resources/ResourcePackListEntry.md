---
title: "ResourcePackListEntry"
description: "public abstract class ResourcePackListEntry extends java.lang.Object implements GuiListExtended.IGuiListEntry"
package: "net/minecraft/client/resources"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/resources/ResourcePackListEntry.html"
sourceType: javadoc
---

# ResourcePackListEntry

## Class signature

```java
public abstract class ResourcePackListEntry extends java.lang.Object implements GuiListExtended.IGuiListEntry
```

## Constructors

- `public ResourcePackListEntry( GuiScreenResourcePacks resourcePacksGUIIn)`

## Methods

- `public void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `protected abstract int getResourcePackFormat()`
- `protected abstract java.lang.String getResourcePackDescription()`
- `protected abstract java.lang.String getResourcePackName()`
- `protected abstract void bindResourcePackIcon()`
- `protected boolean showHoverOverlay()`
- `protected boolean canMoveRight()`
- `protected boolean canMoveLeft()`
- `protected boolean canMoveUp()`
- `protected boolean canMoveDown()`
- `public boolean mousePressed(int slotIndex, int mouseX, int mouseY, int mouseEvent, int relativeX, int relativeY)`
- `public void setSelected(int p_178011_1_, int p_178011_2_, int p_178011_3_)`
- `public void mouseReleased(int slotIndex, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `public boolean isServerPack()`
