---
title: "GuiMultiplayer"
description: "Called by the controls from the buttonList when activated."
package: "net/minecraft/client/gui"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiMultiplayer.html"
sourceType: javadoc
---

# GuiMultiplayer

## Class signature

```java
public class GuiMultiplayer extends GuiScreen implements GuiYesNoCallback
```

## Constructors

- `public GuiMultiplayer( GuiScreen parentScreen)`

## Methods

- `public void initGui()`
- `public void handleMouseInput() throws java.io.IOException`
- `public void createButtons()`
- `public void updateScreen()`
- `public void onGuiClosed()`
- `protected void actionPerformed( GuiButton button) throws java.io.IOException`
- `public void confirmClicked(boolean result, int id)`
- `protected void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `public void connectToSelected()`
- `public void selectServer(int index)`
- `public OldServerPinger getOldServerPinger()`
- `public void setHoveringText(java.lang.String p_146793_1_)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `protected void mouseReleased(int mouseX, int mouseY, int state)`
- `public ServerList getServerList()`
- `public boolean func_175392_a( ServerListEntryNormal p_175392_1_, int p_175392_2_)`
- `public boolean func_175394_b( ServerListEntryNormal p_175394_1_, int p_175394_2_)`
- `public void func_175391_a( ServerListEntryNormal p_175391_1_, int p_175391_2_, boolean p_175391_3_)`
- `public void func_175393_b( ServerListEntryNormal p_175393_1_, int p_175393_2_, boolean p_175393_3_)`

## Description

Called by the controls from the buttonList when activated.
