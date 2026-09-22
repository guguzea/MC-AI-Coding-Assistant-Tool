---
title: "GuiScreenBook"
description: "public class GuiScreenBook extends GuiScreen"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiScreenBook.html"
sourceType: javadoc
---

# GuiScreenBook

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiScreenBook

## Class signature

```java
public class GuiScreenBook extends GuiScreen
```

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `IChatComponent func_175385_b(int p_175385_1_, int p_175385_2_)`
- `protected boolean handleComponentClick(IChatComponent p_175276_1_)` — Executes the click event specified by the given chat component
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `void onGuiClosed()` — Called when the screen is unloaded.
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `GuiScreenBook`
