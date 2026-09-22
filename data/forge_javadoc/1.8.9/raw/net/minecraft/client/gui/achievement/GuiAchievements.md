---
title: "GuiAchievements"
description: "public class GuiAchievements extends GuiScreen implements IProgressMeter"
package: "net/minecraft/client/gui/achievement"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/achievement/GuiAchievements.html"
sourceType: javadoc
---

# GuiAchievements

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.achievement.GuiAchievements

## Class signature

```java
public class GuiAchievements extends GuiScreen implements IProgressMeter
```

## Constructors

- `GuiAchievements(GuiScreen parentScreenIn, StatFileWriter statFileWriterIn)`

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `boolean doesGuiPauseGame()` — Returns true if this GUI should pause the game when it is displayed in single-player
- `void doneLoading()`
- `protected void drawAchievementScreen(int p_146552_1_, int p_146552_2_, float p_146552_3_)`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `protected void drawTitle()`
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `protected int field_146555_f`
- `protected int field_146557_g`
- `protected int field_146563_h`
- `protected int field_146564_i`
- `protected double field_146565_w`
- `protected double field_146566_v`
- `protected double field_146567_u`
- `protected double field_146568_t`
- `protected double field_146569_s`
- `protected float field_146570_r`
- `protected double field_146573_x`
- `protected GuiScreen parentScreen`
