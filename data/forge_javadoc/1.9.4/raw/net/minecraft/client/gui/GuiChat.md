---
title: "GuiChat"
description: "public class GuiChat extends GuiScreen implements ITabCompleter"
package: "net/minecraft/client/gui"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/gui/GuiChat.html"
sourceType: javadoc
---

# GuiChat

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiChat

## Class signature

```java
public class GuiChat extends GuiScreen implements ITabCompleter
```

## Constructors

- `GuiChat()`
- `GuiChat(java.lang.String defaultText)`

## Methods

- `boolean doesGuiPauseGame()`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `void getSentHistory(int msgPos)`
- `void handleMouseInput()`
- `void initGui()`
- `protected void keyTyped(char typedChar, int keyCode)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)`
- `void onGuiClosed()`
- `void setCompletions(java.lang.String... newCompletions)`
- `protected void setText(java.lang.String newChatText, boolean shouldOverwrite)`
- `void updateScreen()`

## Fields

- `protected GuiTextField inputField`
