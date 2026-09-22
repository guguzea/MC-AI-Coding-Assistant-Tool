---
title: "GuiIngame"
description: "public class GuiIngame extends Gui"
package: "net/minecraft/client/gui"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/gui/GuiIngame.html"
sourceType: javadoc
---

# GuiIngame

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiIngame

## Class signature

```java
public class GuiIngame extends Gui
```

## Constructors

- `GuiIngame(Minecraft mcIn)`

## Methods

- `void addChatMessage(ChatType chatTypeIn, ITextComponent message)`
- `void displayTitle(java.lang.String title, java.lang.String subTitle, int timeFadeIn, int displayTime, int timeFadeOut)`
- `GuiBossOverlay getBossOverlay()`
- `GuiNewChat getChatGUI()`
- `FontRenderer getFontRenderer()`
- `GuiSpectator getSpectatorGui()`
- `GuiPlayerTabOverlay getTabList()`
- `int getUpdateCounter()`
- `protected void renderAttackIndicator(float p_184045_1_, ScaledResolution p_184045_2_)`
- `void renderDemo(ScaledResolution scaledRes)`
- `void renderExpBar(ScaledResolution scaledRes, int x)`
- `void renderGameOverlay(float partialTicks)`
- `void renderHorseJumpBar(ScaledResolution scaledRes, int x)`
- `protected void renderHotbar(ScaledResolution sr, float partialTicks)`
- `protected void renderHotbarItem(int p_184044_1_, int p_184044_2_, float p_184044_3_, EntityPlayer player, ItemStack stack)`
- `protected void renderMountHealth(ScaledResolution p_184047_1_)`
- `protected void renderPlayerStats(ScaledResolution scaledRes)`
- `protected void renderPortal(float timeInPortal, ScaledResolution scaledRes)`
- `protected void renderPotionEffects(ScaledResolution resolution)`
- `protected void renderPumpkinOverlay(ScaledResolution scaledRes)`
- `protected void renderScoreboard(ScoreObjective objective, ScaledResolution scaledRes)`
- `void renderSelectedItem(ScaledResolution scaledRes)`
- `protected void renderVignette(float lightLevel, ScaledResolution scaledRes)`
- `void resetPlayersOverlayFooterHeader()`
- `void setDefaultTitlesTimes()`
- `void setOverlayMessage(ITextComponent component, boolean animateColor)`
- `void setOverlayMessage(java.lang.String message, boolean animateColor)`
- `void setRecordPlayingMessage(java.lang.String recordName)`
- `void updateTick()`

## Fields

- `protected boolean animateOverlayMessageColor`
- `protected java.util.Map<ChatType, java.util.List<IChatListener>> chatListeners`
- `protected java.lang.String displayedSubTitle`
- `protected java.lang.String displayedTitle`
- `protected long healthUpdateCounter`
- `protected ItemStack highlightingItemStack`
- `protected RenderItem itemRenderer`
- `protected int lastPlayerHealth`
- `protected long lastSystemTime`
- `protected Minecraft mc`
- `protected GuiBossOverlay overlayBoss`
- `protected GuiOverlayDebug overlayDebug`
- `protected java.lang.String overlayMessage`
- `protected int overlayMessageTime`
- `protected GuiPlayerTabOverlay overlayPlayerList`
- `protected GuiSubtitleOverlay overlaySubtitle`
- `protected GuiNewChat persistantChatGUI`
- `protected int playerHealth`
- `float prevVignetteBrightness`
- `protected static ResourceLocation PUMPKIN_BLUR_TEX_PATH`
- `protected java.util.Random rand`
- `protected int remainingHighlightTicks`
- `protected GuiSpectator spectatorGui`
- `protected int titleDisplayTime`
- `protected int titleFadeIn`
- `protected int titleFadeOut`
- `protected int titlesTimer`
- `protected int updateCounter`
- `protected static ResourceLocation VIGNETTE_TEX_PATH`
- `protected static ResourceLocation WIDGETS_TEX_PATH`
