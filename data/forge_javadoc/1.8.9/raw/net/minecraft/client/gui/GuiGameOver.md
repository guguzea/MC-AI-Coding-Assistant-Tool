---
title: "GuiGameOver"
description: "public class GuiGameOver extends GuiScreen implements GuiYesNoCallback"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiGameOver.html"
sourceType: javadoc
---

# GuiGameOver

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiGameOver

## Class signature

```java
public class GuiGameOver extends GuiScreen implements GuiYesNoCallback
```

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void confirmClicked(boolean result, int id)`
- `boolean doesGuiPauseGame()` — Returns true if this GUI should pause the game when it is displayed in single-player
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `GuiGameOver`
