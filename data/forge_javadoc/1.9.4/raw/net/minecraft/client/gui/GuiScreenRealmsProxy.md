---
title: "GuiScreenRealmsProxy"
description: "public class GuiScreenRealmsProxy extends GuiScreen"
package: "net/minecraft/client/gui"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/gui/GuiScreenRealmsProxy.html"
sourceType: javadoc
---

# GuiScreenRealmsProxy

## Class signature

```java
public class GuiScreenRealmsProxy extends GuiScreen
```

## Constructors

- `public GuiScreenRealmsProxy( RealmsScreen proxyIn)`

## Methods

- `public RealmsScreen getProxy()`
- `public void initGui()`
- `public void drawCenteredString(java.lang.String p_154325_1_, int p_154325_2_, int p_154325_3_, int p_154325_4_)`
- `public void drawString(java.lang.String p_154322_1_, int p_154322_2_, int p_154322_3_, int p_154322_4_, boolean p_154322_5_)`
- `public void drawTexturedModalRect(int x, int y, int textureX, int textureY, int width, int height)`
- `public void drawGradientRect(int left, int top, int right, int bottom, int startColor, int endColor)`
- `public void drawDefaultBackground()`
- `public boolean doesGuiPauseGame()`
- `public void drawWorldBackground(int tint)`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`
- `public void renderToolTip( ItemStack stack, int x, int y)`
- `public void drawCreativeTabHoveringText(java.lang.String tabName, int mouseX, int mouseY)`
- `public void drawHoveringText(java.util.List<java.lang.String> textLines, int x, int y)`
- `public void updateScreen()`
- `public int getFontHeight()`
- `public int getStringWidth(java.lang.String p_154326_1_)`
- `public void fontDrawShadow(java.lang.String p_154319_1_, int p_154319_2_, int p_154319_3_, int p_154319_4_)`
- `public java.util.List<java.lang.String> fontSplit(java.lang.String p_154323_1_, int p_154323_2_)`
- `public final void actionPerformed( GuiButton button) throws java.io.IOException`
- `public void buttonsClear()`
- `public void buttonsAdd( RealmsButton button)`
- `public java.util.List< RealmsButton > buttons()`
- `public void buttonsRemove( RealmsButton button)`
- `public void mouseClicked(int mouseX, int mouseY, int mouseButton) throws java.io.IOException`
- `public void handleMouseInput() throws java.io.IOException`
- `public void handleKeyboardInput() throws java.io.IOException`
- `public void mouseReleased(int mouseX, int mouseY, int state)`
- `public void mouseClickMove(int mouseX, int mouseY, int clickedMouseButton, long timeSinceLastClick)`
- `public void keyTyped(char typedChar, int keyCode) throws java.io.IOException`
- `public void confirmClicked(boolean result, int id)`
- `public void onGuiClosed()`
