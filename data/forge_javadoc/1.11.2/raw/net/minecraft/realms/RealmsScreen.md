---
title: "RealmsScreen"
description: "public class RealmsScreen extends java.lang.Object"
package: "net/minecraft/realms"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/realms/RealmsScreen.html"
sourceType: javadoc
---

# RealmsScreen

## Class signature

```java
public class RealmsScreen extends java.lang.Object
```

## Constructors

- `public RealmsScreen()`

## Methods

- `public GuiScreenRealmsProxy getProxy()`
- `public void init()`
- `public void init( Minecraft p_init_1_, int p_init_2_, int p_init_3_)`
- `public void drawCenteredString(java.lang.String p_drawCenteredString_1_, int p_drawCenteredString_2_, int p_drawCenteredString_3_, int p_drawCenteredString_4_)`
- `public void drawString(java.lang.String p_drawString_1_, int p_drawString_2_, int p_drawString_3_, int p_drawString_4_)`
- `public void drawString(java.lang.String p_drawString_1_, int p_drawString_2_, int p_drawString_3_, int p_drawString_4_, boolean p_drawString_5_)`
- `public void blit(int p_blit_1_, int p_blit_2_, int p_blit_3_, int p_blit_4_, int p_blit_5_, int p_blit_6_)`
- `public static void blit(int p_blit_0_, int p_blit_1_, float p_blit_2_, float p_blit_3_, int p_blit_4_, int p_blit_5_, int p_blit_6_, int p_blit_7_, float p_blit_8_, float p_blit_9_)`
- `public static void blit(int p_blit_0_, int p_blit_1_, float p_blit_2_, float p_blit_3_, int p_blit_4_, int p_blit_5_, float p_blit_6_, float p_blit_7_)`
- `public void fillGradient(int p_fillGradient_1_, int p_fillGradient_2_, int p_fillGradient_3_, int p_fillGradient_4_, int p_fillGradient_5_, int p_fillGradient_6_)`
- `public void renderBackground()`
- `public boolean isPauseScreen()`
- `public void renderBackground(int p_renderBackground_1_)`
- `public void render(int p_render_1_, int p_render_2_, float p_render_3_)`
- `public void renderTooltip( ItemStack p_renderTooltip_1_, int p_renderTooltip_2_, int p_renderTooltip_3_)`
- `public void renderTooltip(java.lang.String p_renderTooltip_1_, int p_renderTooltip_2_, int p_renderTooltip_3_)`
- `public void renderTooltip(java.util.List<java.lang.String> p_renderTooltip_1_, int p_renderTooltip_2_, int p_renderTooltip_3_)`
- `public static void bindFace(java.lang.String p_bindFace_0_, java.lang.String p_bindFace_1_)`
- `public static void bind(java.lang.String p_bind_0_)`
- `public void tick()`
- `public int width()`
- `public int height()`
- `public int fontLineHeight()`
- `public int fontWidth(java.lang.String p_fontWidth_1_)`
- `public void fontDrawShadow(java.lang.String p_fontDrawShadow_1_, int p_fontDrawShadow_2_, int p_fontDrawShadow_3_, int p_fontDrawShadow_4_)`
- `public java.util.List<java.lang.String> fontSplit(java.lang.String p_fontSplit_1_, int p_fontSplit_2_)`
- `public void buttonClicked( RealmsButton p_buttonClicked_1_)`
- `public static RealmsButton newButton(int p_newButton_0_, int p_newButton_1_, int p_newButton_2_, java.lang.String p_newButton_3_)`
- `public static RealmsButton newButton(int p_newButton_0_, int p_newButton_1_, int p_newButton_2_, int p_newButton_3_, int p_newButton_4_, java.lang.String p_newButton_5_)`
- `public void buttonsClear()`
- `public void buttonsAdd( RealmsButton p_buttonsAdd_1_)`
- `public java.util.List< RealmsButton > buttons()`
- `public void buttonsRemove( RealmsButton p_buttonsRemove_1_)`
- `public RealmsEditBox newEditBox(int p_newEditBox_1_, int p_newEditBox_2_, int p_newEditBox_3_, int p_newEditBox_4_, int p_newEditBox_5_)`
- `public void mouseClicked(int p_mouseClicked_1_, int p_mouseClicked_2_, int p_mouseClicked_3_)`
- `public void mouseEvent()`
- `public void keyboardEvent()`
- `public void mouseReleased(int p_mouseReleased_1_, int p_mouseReleased_2_, int p_mouseReleased_3_)`
- `public void mouseDragged(int p_mouseDragged_1_, int p_mouseDragged_2_, int p_mouseDragged_3_, long p_mouseDragged_4_)`
- `public void keyPressed(char p_keyPressed_1_, int p_keyPressed_2_)`
- `public void confirmResult(boolean p_confirmResult_1_, int p_confirmResult_2_)`
- `public static java.lang.String getLocalizedString(java.lang.String p_getLocalizedString_0_)`
- `public static java.lang.String getLocalizedString(java.lang.String p_getLocalizedString_0_, java.lang.Object... p_getLocalizedString_1_)`
- `public RealmsAnvilLevelStorageSource getLevelStorageSource()`
- `public void removed()`
