---
title: "GuiCreateWorld"
description: "public class GuiCreateWorld extends GuiScreen"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiCreateWorld.html"
sourceType: javadoc
---

# GuiCreateWorld

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiCreateWorld

## Class signature

```java
public class GuiCreateWorld extends GuiScreen
```

## Constructors

- `GuiCreateWorld(GuiScreen p_i46320_1_)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `static java.lang.String func_146317_a(ISaveFormat p_146317_0_, java.lang.String p_146317_1_)`
- `void func_146318_a(WorldInfo p_146318_1_)`
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `void onGuiClosed()` — Called when the screen is unloaded.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `java.lang.String chunkProviderSettingsJson`
