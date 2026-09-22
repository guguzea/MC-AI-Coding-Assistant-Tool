---
title: "ResourcePackListEntry"
description: "public abstract class ResourcePackListEntry extends java.lang.Object implements GuiListExtended.IGuiListEntry"
package: "net/minecraft/client/resources"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/resources/ResourcePackListEntry.html"
sourceType: javadoc
---

# ResourcePackListEntry

**Inheritance:** java.lang.Object → net.minecraft.client.resources.ResourcePackListEntry

## Class signature

```java
public abstract class ResourcePackListEntry extends java.lang.Object implements GuiListExtended.IGuiListEntry
```

## Constructors

- `ResourcePackListEntry(GuiScreenResourcePacks resourcePacksGUIIn)`

## Methods

- `protected abstract void bindResourcePackIcon()`
- `protected boolean canMoveDown()`
- `protected boolean canMoveLeft()`
- `protected boolean canMoveRight()`
- `protected boolean canMoveUp()`
- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `protected abstract java.lang.String getResourcePackDescription()`
- `protected abstract int getResourcePackFormat()`
- `protected abstract java.lang.String getResourcePackName()`
- `boolean isServerPack()`
- `boolean mousePressed(int slotIndex, int mouseX, int mouseY, int mouseEvent, int relativeX, int relativeY)`
- `void mouseReleased(int slotIndex, int x, int y, int mouseEvent, int relativeX, int relativeY)`
- `void setSelected(int p_178011_1_, int p_178011_2_, int p_178011_3_)`
- `protected boolean showHoverOverlay()`

## Fields

- `protected Minecraft mc`
- `protected GuiScreenResourcePacks resourcePacksGUI`
