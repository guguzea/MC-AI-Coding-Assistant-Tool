---
title: "GuiStats"
description: "public class GuiStats extends GuiScreen implements IProgressMeter"
package: "net/minecraft/client/gui/achievement"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/achievement/GuiStats.html"
sourceType: javadoc
---

# GuiStats

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.achievement.GuiStats

## Class signature

```java
public class GuiStats extends GuiScreen implements IProgressMeter
```

## Constructors

- `GuiStats(GuiScreen p_i1071_1_, StatFileWriter p_i1071_2_)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void createButtons()`
- `boolean doesGuiPauseGame()` — Returns true if this GUI should pause the game when it is displayed in single-player
- `void doneLoading()`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void func_175366_f()`
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.

## Fields

- `protected GuiScreen parentScreen`
- `protected java.lang.String screenTitle`
