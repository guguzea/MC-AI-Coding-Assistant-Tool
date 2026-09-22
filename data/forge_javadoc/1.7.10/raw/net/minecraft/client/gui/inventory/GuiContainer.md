---
title: "GuiContainer"
description: "public abstract class GuiContainer extends GuiScreen"
package: "net/minecraft/client/gui/inventory"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/gui/inventory/GuiContainer.html"
sourceType: javadoc
---

# GuiContainer

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.inventory.GuiContainer

## Class signature

```java
public abstract class GuiContainer extends GuiScreen
```

## Constructors

- `GuiContainer(Container p_i1072_1_)`

## Methods

- `protected boolean checkHotbarKeys(int p_146983_1_)`
- `boolean doesGuiPauseGame()`
- `protected abstract void drawGuiContainerBackgroundLayer(float p_146976_1_, int p_146976_2_, int p_146976_3_)`
- `protected void drawGuiContainerForegroundLayer(int p_146979_1_, int p_146979_2_)`
- `void drawScreen(int p_73863_1_, int p_73863_2_, float p_73863_3_)`
- `protected boolean func_146978_c(int p_146978_1_, int p_146978_2_, int p_146978_3_, int p_146978_4_, int p_146978_5_, int p_146978_6_)`
- `protected void handleMouseClick(Slot p_146984_1_, int p_146984_2_, int p_146984_3_, int p_146984_4_)`
- `void initGui()`
- `protected void keyTyped(char p_73869_1_, int p_73869_2_)`
- `protected void mouseClicked(int p_73864_1_, int p_73864_2_, int p_73864_3_)`
- `protected void mouseClickMove(int p_146273_1_, int p_146273_2_, int p_146273_3_, long p_146273_4_)`
- `protected void mouseMovedOrUp(int p_146286_1_, int p_146286_2_, int p_146286_3_)`
- `void onGuiClosed()`
- `void updateScreen()`

## Fields

- `protected static ResourceLocation field_147001_a`
- `protected boolean field_147007_t`
- `protected java.util.Set field_147008_s`
- `protected int guiLeft`
- `protected int guiTop`
- `Container inventorySlots`
- `protected int xSize`
- `protected int ySize`
