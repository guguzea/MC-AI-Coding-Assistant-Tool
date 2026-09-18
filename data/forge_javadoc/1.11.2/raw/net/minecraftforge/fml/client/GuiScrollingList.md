---
title: "GuiScrollingList"
description: "Deprecated."
package: "net/minecraftforge/fml/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/client/GuiScrollingList.html"
sourceType: javadoc
---

# GuiScrollingList

## Class signature

```java
public abstract class GuiScrollingList extends java.lang.Object
```

## Constructors

- `public GuiScrollingList( Minecraft client, int width, int height, int top, int bottom, int left, int entryHeight, int screenWidth, int screenHeight)`

## Methods

- `@Deprecated public GuiScrollingList( Minecraft client, int width, int height, int top, int bottom, int left, int entryHeight)`
- `@Deprecated public void func_27258_a(boolean p_27258_1_)`
- `@Deprecated protected void func_27259_a(boolean hasFooter, int footerHeight)`
- `protected void setHeaderInfo(boolean hasHeader, int headerHeight)`
- `protected abstract int getSize()`
- `protected abstract void elementClicked(int index, boolean doubleClick)`
- `protected abstract boolean isSelected(int index)`
- `protected int getContentHeight()`
- `protected abstract void drawBackground()`
- `protected abstract void drawSlot(int slotIdx, int entryRight, int slotTop, int slotBuffer, Tessellator tess)`
- `@Deprecated protected void func_27260_a(int entryRight, int relativeY, Tessellator tess)`
- `protected void drawHeader(int entryRight, int relativeY, Tessellator tess)`
- `@Deprecated protected void func_27255_a(int x, int y)`
- `protected void clickHeader(int x, int y)`
- `@Deprecated protected void func_27257_b(int mouseX, int mouseY)`
- `protected void drawScreen(int mouseX, int mouseY)`
- `@Deprecated public int func_27256_c(int x, int y)`
- `public void registerScrollButtons(java.util.List< GuiButton > buttons, int upActionID, int downActionID)`
- `public void actionPerformed( GuiButton button)`
- `public void handleMouseInput(int mouseX, int mouseY) throws java.io.IOException`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `protected void drawGradientRect(int left, int top, int right, int bottom, int color1, int color2)`

## Description

Deprecated.
