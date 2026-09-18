---
title: "GuiCrafting"
description: "public class GuiCrafting extends GuiContainer implements IRecipeShownListener"
package: "net/minecraft/client/gui/inventory"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/inventory/GuiCrafting.html"
sourceType: javadoc
---

# GuiCrafting

## Class signature

```java
public class GuiCrafting extends GuiContainer implements IRecipeShownListener
```

## Constructors

- `public GuiCrafting( InventoryPlayer playerInv, World worldIn)`
- `public GuiCrafting( InventoryPlayer playerInv, World worldIn, BlockPos blockPosition)`

## Methods

- `public void initGui()`
- `public void updateScreen()`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)`
- `protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)`
- `protected boolean isPointInRegion(int rectX, int rectY, int rectWidth, int rectHeight, int pointX, int pointY)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `protected boolean hasClickedOutside(int p_193983_1_, int p_193983_2_, int p_193983_3_, int p_193983_4_)`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `protected void handleMouseClick( Slot slotIn, int slotId, int mouseButton, ClickType type)`
- `public void recipesUpdated()`
- `public void onGuiClosed()`
- `public GuiRecipeBook func_194310_f()`
