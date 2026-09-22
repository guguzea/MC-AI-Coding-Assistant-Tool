---
title: "ResourcePackListEntry"
description: "public abstract class ResourcePackListEntry extends java.lang.Object implements GuiListExtended.IGuiListEntry"
package: "net/minecraft/client/resources"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/resources/ResourcePackListEntry.html"
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

- `void drawEntry(int slotIndex, int x, int y, int listWidth, int slotHeight, int mouseX, int mouseY, boolean isSelected)`
- `protected boolean func_148307_h()`
- `protected boolean func_148308_f()`
- `protected boolean func_148309_e()`
- `protected boolean func_148310_d()`
- `protected abstract java.lang.String func_148311_a()`
- `protected abstract java.lang.String func_148312_b()`
- `protected abstract void func_148313_c()`
- `protected boolean func_148314_g()`
- `protected abstract int func_183019_a()`
- `boolean mousePressed(int slotIndex, int p_148278_2_, int p_148278_3_, int p_148278_4_, int p_148278_5_, int p_148278_6_)` — Returns true if the mouse has been pressed on this control.
- `void mouseReleased(int slotIndex, int x, int y, int mouseEvent, int relativeX, int relativeY)` — Fired when the mouse button is released.
- `void setSelected(int p_178011_1_, int p_178011_2_, int p_178011_3_)`

## Fields

- `protected Minecraft mc`
- `protected GuiScreenResourcePacks resourcePacksGUI`
