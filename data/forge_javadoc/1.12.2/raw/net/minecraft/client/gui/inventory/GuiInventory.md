---
title: "GuiInventory"
description: "public class GuiInventory extends InventoryEffectRenderer implements IRecipeShownListener"
package: "net/minecraft/client/gui/inventory"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/inventory/GuiInventory.html"
sourceType: javadoc
---

# GuiInventory

## Class signature

```java
public class GuiInventory extends InventoryEffectRenderer implements IRecipeShownListener
```

## Constructors

- `public GuiInventory( EntityPlayer player)`

## Methods

- `public void updateScreen()`
- `public void initGui()`
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)`
- `public static void drawEntityOnScreen(int posX, int posY, int scale, float mouseX, float mouseY, EntityLivingBase ent)`
- `protected boolean isPointInRegion(int rectX, int rectY, int rectWidth, int rectHeight, int pointX, int pointY)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `protected void mouseReleased(int mouseX, int mouseY, int state)`
- `protected boolean hasClickedOutside(int p_193983_1_, int p_193983_2_, int p_193983_3_, int p_193983_4_)`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `protected void handleMouseClick( Slot slotIn, int slotId, int mouseButton, ClickType type)`
- `public void recipesUpdated()`
- `public void onGuiClosed()`
- `public GuiRecipeBook func_194310_f()`
