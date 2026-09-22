---
title: "GuiResourcePackList"
description: "public abstract class GuiResourcePackList extends GuiListExtended"
package: "net/minecraft/client/gui"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/gui/GuiResourcePackList.html"
sourceType: javadoc
---

# GuiResourcePackList

**Inheritance:** java.lang.Object → net.minecraft.client.gui.GuiSlot → net.minecraft.client.gui.GuiListExtended → net.minecraft.client.gui.GuiResourcePackList

## Class signature

```java
public abstract class GuiResourcePackList extends GuiListExtended
```

## Constructors

- `GuiResourcePackList(Minecraft mcIn, int p_i45055_2_, int p_i45055_3_, java.util.List<ResourcePackListEntry> p_i45055_4_)`

## Methods

- `protected void drawListHeader(int insideLeft, int insideTop, Tessellator tessellatorIn)`
- `java.util.List<ResourcePackListEntry> getList()`
- `ResourcePackListEntry getListEntry(int index)`
- `protected abstract java.lang.String getListHeader()`
- `int getListWidth()`
- `protected int getScrollBarX()`
- `protected int getSize()`

## Fields

- `protected Minecraft mc`
- `protected java.util.List<ResourcePackListEntry> resourcePackEntries`
