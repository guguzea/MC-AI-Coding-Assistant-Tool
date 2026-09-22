---
title: "GuiIngame"
description: "public class GuiIngame extends Gui"
package: "net/minecraft/client/gui"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiIngame.html"
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

- `void displayTitle(java.lang.String p_175178_1_, java.lang.String p_175178_2_, int p_175178_3_, int p_175178_4_, int p_175178_5_)`
- `void func_175177_a()`
- `void func_181029_i()`
- `GuiNewChat getChatGUI()` — returns a pointer to the persistant Chat GUI, containing all previous chat messages and such
- `FontRenderer getFontRenderer()`
- `GuiSpectator getSpectatorGui()`
- `GuiPlayerTabOverlay getTabList()`
- `int getUpdateCounter()`
- `protected void renderBossHealth()` — Renders dragon's (boss) health on the HUD
- `void renderDemo(ScaledResolution p_175185_1_)`
- `void renderExpBar(ScaledResolution p_175176_1_, int p_175176_2_)`
- `void renderGameOverlay(float partialTicks)`
- `void renderHorseJumpBar(ScaledResolution p_175186_1_, int p_175186_2_)`
- `protected void renderHotbarItem(int index, int xPos, int yPos, float partialTicks, EntityPlayer p_175184_5_)`
- `protected void renderPlayerStats(ScaledResolution p_180477_1_)`
- `protected void renderPortal(float p_180474_1_, ScaledResolution p_180474_2_)`
- `protected void renderPumpkinOverlay(ScaledResolution p_180476_1_)`
- `protected void renderScoreboard(ScoreObjective p_180475_1_, ScaledResolution p_180475_2_)`
- `void renderSelectedItem(ScaledResolution p_181551_1_)`
- `void renderStreamIndicator(ScaledResolution p_180478_1_)`
- `protected void renderTooltip(ScaledResolution sr, float partialTicks)`
- `protected void renderVignette(float p_180480_1_, ScaledResolution p_180480_2_)` — Renders a Vignette arount the entire screen that changes with light level.
- `void setRecordPlaying(IChatComponent p_175188_1_, boolean p_175188_2_)`
- `void setRecordPlaying(java.lang.String p_110326_1_, boolean p_110326_2_)`
- `void setRecordPlayingMessage(java.lang.String p_73833_1_)`
- `protected boolean showCrosshair()`
- `void updateTick()` — The update tick for the ingame UI

## Fields

- `protected int field_175192_A`
- `protected int field_175193_B`
- `protected int field_175195_w`
- `protected int field_175199_z`
- `protected java.lang.String field_175200_y`
- `protected java.lang.String field_175201_x`
- `protected long healthUpdateCounter` — Used with updateCounter to make the heart bar flash
- `protected ItemStack highlightingItemStack` — The ItemStack that is currently being highlighted
- `protected RenderItem itemRenderer`
- `protected int lastPlayerHealth`
- `protected long lastSystemTime` — The last recorded system time
- `protected Minecraft mc`
- `protected GuiOverlayDebug overlayDebug`
- `protected GuiPlayerTabOverlay overlayPlayerList`
- `protected GuiNewChat persistantChatGUI` — ChatGUI instance that retains all previous chat data
- `protected int playerHealth`
- `float prevVignetteBrightness` — Previous frame vignette brightness (slowly changes by 1% each frame)
- `protected static ResourceLocation pumpkinBlurTexPath`
- `protected java.util.Random rand`
- `protected boolean recordIsPlaying`
- `protected java.lang.String recordPlaying` — The string specifying which record music is playing
- `protected int recordPlayingUpFor` — How many ticks the record playing message will be displayed
- `protected int remainingHighlightTicks` — Remaining ticks the item highlight should be visible
- `protected GuiSpectator spectatorGui` — The spectator GUI for this in-game GUI instance
- `protected GuiStreamIndicator streamIndicator`
- `protected int updateCounter`
- `protected static ResourceLocation vignetteTexPath`
- `protected static ResourceLocation widgetsTexPath`
