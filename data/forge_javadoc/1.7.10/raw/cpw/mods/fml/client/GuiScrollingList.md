---
title: "GuiScrollingList"
description: "public abstract class GuiScrollingList extends java.lang.Object"
package: "cpw/mods/fml/client"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/GuiScrollingList.html"
sourceType: javadoc
---

# GuiScrollingList

**Inheritance:** java.lang.Object → cpw.mods.fml.client.GuiScrollingList

## Class signature

```java
public abstract class GuiScrollingList extends java.lang.Object
```

## Constructors

- `GuiScrollingList(Minecraft client, int width, int height, int top, int bottom, int left, int entryHeight)`

## Methods

- `void actionPerformed(GuiButton button)`
- `protected abstract void drawBackground()`
- `protected void drawGradientRect(int par1, int par2, int par3, int par4, int par5, int par6)`
- `void drawScreen(int mouseX, int mouseY, float p_22243_3_)`
- `protected abstract void drawSlot(int var1, int var2, int var3, int var4, Tessellator var5)`
- `protected abstract void elementClicked(int index, boolean doubleClick)`
- `protected void func_27255_a(int p_27255_1_, int p_27255_2_)`
- `int func_27256_c(int p_27256_1_, int p_27256_2_)`
- `protected void func_27257_b(int p_27257_1_, int p_27257_2_)`
- `void func_27258_a(boolean p_27258_1_)`
- `protected void func_27259_a(boolean p_27259_1_, int p_27259_2_)`
- `protected void func_27260_a(int p_27260_1_, int p_27260_2_, Tessellator p_27260_3_)`
- `protected int getContentHeight()`
- `protected abstract int getSize()`
- `protected abstract boolean isSelected(int index)`
- `void registerScrollButtons(java.util.List p_22240_1_, int p_22240_2_, int p_22240_3_)`

## Fields

- `protected int bottom`
- `protected int left`
- `protected int listHeight`
- `protected int listWidth`
- `protected int mouseX`
- `protected int mouseY`
- `protected int slotHeight`
- `protected int top`
