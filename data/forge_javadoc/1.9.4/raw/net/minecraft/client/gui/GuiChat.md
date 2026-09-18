---
title: "GuiChat"
description: "public class GuiChat extends GuiScreen implements ITabCompleter"
package: "net/minecraft/client/gui"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/gui/GuiChat.html"
sourceType: javadoc
---

# GuiChat

## Class signature

```java
public class GuiChat extends GuiScreen implements ITabCompleter
```

## Constructors

- `public GuiChat()`
- `public GuiChat(java.lang.String defaultText)`

## Methods

- `public void initGui()`
- `public void onGuiClosed()`
- `public void updateScreen()`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `public void handleMouseInput() throws java.io.IOException`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `protected void setText(java.lang.String newChatText, boolean shouldOverwrite)`
- `public void getSentHistory(int msgPos)`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `public boolean doesGuiPauseGame()`
- `public void setCompletions(java.lang.String... newCompletions)`
