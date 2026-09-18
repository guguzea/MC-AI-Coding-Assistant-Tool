---
title: "GuiScrollingList"
description: "public abstract class GuiScrollingList extends java.lang.Object"
package: "cpw/mods/fml/client"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/GuiScrollingList.html"
sourceType: javadoc
---

# GuiScrollingList

## Class signature

```java
public abstract class GuiScrollingList extends java.lang.Object
```

## Constructors

- `public GuiScrollingList( Minecraft client, int width, int height, int top, int bottom, int left, int entryHeight)`

## Methods

- `public void func_27258_a(boolean p_27258_1_)`
- `protected void func_27259_a(boolean p_27259_1_, int p_27259_2_)`
- `protected abstract int getSize()`
- `protected abstract void elementClicked(int index, boolean doubleClick)`
- `protected abstract boolean isSelected(int index)`
- `protected int getContentHeight()`
- `protected abstract void drawBackground()`
- `protected abstract void drawSlot(int var1, int var2, int var3, int var4, Tessellator var5)`
- `protected void func_27260_a(int p_27260_1_, int p_27260_2_, Tessellator p_27260_3_)`
- `protected void func_27255_a(int p_27255_1_, int p_27255_2_)`
- `protected void func_27257_b(int p_27257_1_, int p_27257_2_)`
- `public int func_27256_c(int p_27256_1_, int p_27256_2_)`
- `public void registerScrollButtons(java.util.List p_22240_1_, int p_22240_2_, int p_22240_3_)`
- `public void actionPerformed( GuiButton button)`
- `public void drawScreen(int mouseX, int mouseY, float p_22243_3_)`
- `protected void drawGradientRect(int par1, int par2, int par3, int par4, int par5, int par6)`
