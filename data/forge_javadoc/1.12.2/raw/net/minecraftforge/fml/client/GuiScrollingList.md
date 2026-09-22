---
title: "GuiScrollingList"
description: "public abstract class GuiScrollingList extends java.lang.Object"
package: "net/minecraftforge/fml/client"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/client/GuiScrollingList.html"
sourceType: javadoc
---

# GuiScrollingList

**Inheritance:** java.lang.Object → net.minecraftforge.fml.client.GuiScrollingList

## Class signature

```java
public abstract class GuiScrollingList extends java.lang.Object
```

## Constructors

- `@Deprecated GuiScrollingList(Minecraft client, int width, int height, int top, int bottom, int left, int entryHeight)`
- `GuiScrollingList(Minecraft client, int width, int height, int top, int bottom, int left, int entryHeight, int screenWidth, int screenHeight)`

## Methods

- `void actionPerformed(GuiButton button)`
- `protected void clickHeader(int x, int y)`
- `protected abstract void drawBackground()`
- `protected void drawGradientRect(int left, int top, int right, int bottom, int color1, int color2)`
- `protected void drawHeader(int entryRight, int relativeY, Tessellator tess)` — Draw anything special on the screen.
- `protected void drawScreen(int mouseX, int mouseY)` — Draw anything special on the screen.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `protected abstract void drawSlot(int slotIdx, int entryRight, int slotTop, int slotBuffer, Tessellator tess)` — Draw anything special on the screen.
- `protected abstract void elementClicked(int index, boolean doubleClick)`
- `@Deprecated protected void func_27255_a(int x, int y)`
- `@Deprecated int func_27256_c(int x, int y)`
- `@Deprecated protected void func_27257_b(int mouseX, int mouseY)`
- `@Deprecated void func_27258_a(boolean p_27258_1_)`
- `@Deprecated protected void func_27259_a(boolean hasFooter, int footerHeight)`
- `@Deprecated protected void func_27260_a(int entryRight, int relativeY, Tessellator tess)`
- `protected int getContentHeight()`
- `protected abstract int getSize()`
- `void handleMouseInput(int mouseX, int mouseY)`
- `protected abstract boolean isSelected(int index)`
- `void registerScrollButtons(java.util.List<GuiButton> buttons, int upActionID, int downActionID)`
- `protected void setHeaderInfo(boolean hasHeader, int headerHeight)`

## Fields

- `protected int bottom`
- `protected boolean captureMouse`
- `protected int left`
- `protected int listHeight`
- `protected int listWidth`
- `protected int mouseX`
- `protected int mouseY`
- `protected int right`
- `protected int screenHeight`
- `protected int screenWidth`
- `protected int selectedIndex`
- `protected int slotHeight`
- `protected int top`
