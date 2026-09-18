---
title: "GuiMultiplayer"
description: "public class GuiMultiplayer extends GuiScreen"
package: "net/minecraft/client/gui"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/gui/GuiMultiplayer.html"
sourceType: javadoc
---

# GuiMultiplayer

## Class signature

```java
public class GuiMultiplayer extends GuiScreen
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
- `public ServerPinger getOldServerPinger()`
- `public void setHoveringText(java.lang.String p_146793_1_)`
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `protected void mouseReleased(int mouseX, int mouseY, int state)`
- `public ServerList getServerList()`
- `public boolean canMoveUp( ServerListEntryNormal p_175392_1_, int p_175392_2_)`
- `public boolean canMoveDown( ServerListEntryNormal p_175394_1_, int p_175394_2_)`
- `public void moveServerUp( ServerListEntryNormal p_175391_1_, int p_175391_2_, boolean p_175391_3_)`
- `public void moveServerDown( ServerListEntryNormal p_175393_1_, int p_175393_2_, boolean p_175393_3_)`
