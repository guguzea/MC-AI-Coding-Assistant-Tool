---
title: "GuiChat"
description: "public class GuiChat extends GuiScreen"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiChat.html"
sourceType: javadoc
---

# GuiChat

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiChat

## Class signature

```java
public class GuiChat extends GuiScreen
```

## Constructors

- `GuiChat()`
- `GuiChat(java.lang.String defaultText)`

## Methods

- `void autocompletePlayerNames()`
- `boolean doesGuiPauseGame()` — Returns true if this GUI should pause the game when it is displayed in single-player
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void getSentHistory(int msgPos)` — input is relative and is applied directly to the sentHistoryCursor so -1 is the previous message, 1 is the next message from the current cursor position
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `void onAutocompleteResponse(java.lang.String[] p_146406_1_)`
- `void onGuiClosed()` — Called when the screen is unloaded.
- `protected void setText(java.lang.String newChatText, boolean shouldOverwrite)` — Sets the text of the chat
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `protected GuiTextField inputField` — Chat entry field
