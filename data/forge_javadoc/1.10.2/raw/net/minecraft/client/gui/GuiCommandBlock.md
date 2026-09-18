---
title: "GuiCommandBlock"
description: "public class GuiCommandBlock extends GuiScreen implements ITabCompleter"
package: "net/minecraft/client/gui"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/gui/GuiCommandBlock.html"
sourceType: javadoc
---

# GuiCommandBlock

## Class signature

```java
public class GuiCommandBlock extends GuiScreen implements ITabCompleter
```

## Constructors

- `public GuiCommandBlock( TileEntityCommandBlock commandBlockIn)`

## Methods

- `public void updateScreen()`
- `public void initGui()`
- `public void updateGui()`
- `public void onGuiClosed()`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `public void setCompletions(java.lang.String... newCompletions)`
