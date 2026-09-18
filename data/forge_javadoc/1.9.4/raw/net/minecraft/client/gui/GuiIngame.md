---
title: "GuiIngame"
description: "public class GuiIngame extends Gui"
package: "net/minecraft/client/gui"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/gui/GuiIngame.html"
sourceType: javadoc
---

# GuiIngame

## Class signature

```java
public class GuiIngame extends Gui
```

## Constructors

- `public GuiIngame( Minecraft mcIn)`

## Methods

- `public void setDefaultTitlesTimes()`
- `public void renderGameOverlay(float partialTicks)`
- `protected void renderAttackIndicator(float p_184045_1_, ScaledResolution p_184045_2_)`
- `protected void renderPotionEffects( ScaledResolution resolution)`
- `protected void renderHotbar( ScaledResolution sr, float partialTicks)`
- `public void renderHorseJumpBar( ScaledResolution scaledRes, int x)`
- `public void renderExpBar( ScaledResolution scaledRes, int x)`
- `public void renderSelectedItem( ScaledResolution scaledRes)`
- `public void renderDemo( ScaledResolution scaledRes)`
- `protected void renderScoreboard( ScoreObjective objective, ScaledResolution scaledRes)`
- `protected void renderPlayerStats( ScaledResolution scaledRes)`
- `protected void renderMountHealth( ScaledResolution p_184047_1_)`
- `protected void renderPumpkinOverlay( ScaledResolution scaledRes)`
- `protected void renderVignette(float lightLevel, ScaledResolution scaledRes)`
- `protected void renderPortal(float timeInPortal, ScaledResolution scaledRes)`
- `protected void renderHotbarItem(int p_184044_1_, int p_184044_2_, float p_184044_3_, EntityPlayer player, @Nullable ItemStack stack)`
- `public void updateTick()`
- `public void setRecordPlayingMessage(java.lang.String recordName)`
- `public void setRecordPlaying(java.lang.String message, boolean isPlaying)`
- `public void displayTitle(java.lang.String title, java.lang.String subTitle, int timeFadeIn, int displayTime, int timeFadeOut)`
- `public void setRecordPlaying( ITextComponent component, boolean isPlaying)`
- `public GuiNewChat getChatGUI()`
- `public int getUpdateCounter()`
- `public FontRenderer getFontRenderer()`
- `public GuiSpectator getSpectatorGui()`
- `public GuiPlayerTabOverlay getTabList()`
- `public void resetPlayersOverlayFooterHeader()`
- `public GuiBossOverlay getBossOverlay()`
