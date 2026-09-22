---
title: "GuiMerchant"
description: "public class GuiMerchant extends GuiContainer"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiMerchant.html"
sourceType: javadoc
---

# GuiMerchant

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.inventory.GuiContainer → net.minecraft.client.gui.GuiMerchant

## Class signature

```java
public class GuiMerchant extends GuiContainer
```

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY)` — Args : renderPartialTicks, mouseX, mouseY
- `protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY)` — Draw the foreground layer for the GuiContainer (everything in front of the items).
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `IMerchant getMerchant()`
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `GuiMerchant`
