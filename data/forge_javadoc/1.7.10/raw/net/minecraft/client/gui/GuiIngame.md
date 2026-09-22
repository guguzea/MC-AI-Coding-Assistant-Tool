---
title: "GuiIngame"
description: "public class GuiIngame extends Gui"
package: "net/minecraft/client/gui"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/gui/GuiIngame.html"
sourceType: javadoc
---

# GuiIngame

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiIngame

## Class signature

```java
public class GuiIngame extends Gui
```

## Constructors

- `GuiIngame(Minecraft p_i1036_1_)`

## Methods

- `void func_110326_a(java.lang.String p_110326_1_, boolean p_110326_2_)`
- `protected void func_110327_a(int p_110327_1_, int p_110327_2_)`
- `protected void func_130015_b(float p_130015_1_, int p_130015_2_, int p_130015_3_)`
- `void func_152126_a(float p_152126_1_, float p_152126_2_)`
- `protected void func_96136_a(ScoreObjective p_96136_1_, int p_96136_2_, int p_96136_3_, FontRenderer p_96136_4_)`
- `GuiNewChat getChatGUI()`
- `int getUpdateCounter()`
- `protected void renderBossHealth()`
- `void renderGameOverlay(float p_73830_1_, boolean p_73830_2_, int p_73830_3_, int p_73830_4_)`
- `protected void renderInventorySlot(int p_73832_1_, int p_73832_2_, int p_73832_3_, float p_73832_4_)`
- `protected void renderPumpkinBlur(int p_73836_1_, int p_73836_2_)`
- `protected void renderVignette(float p_73829_1_, int p_73829_2_, int p_73829_3_)`
- `void setRecordPlayingMessage(java.lang.String p_73833_1_)`
- `void updateTick()`

## Fields

- `protected GuiStreamIndicator field_152127_m`
- `protected ItemStack highlightingItemStack`
- `protected static RenderItem itemRenderer`
- `protected Minecraft mc`
- `protected GuiNewChat persistantChatGUI`
- `float prevVignetteBrightness`
- `protected static ResourceLocation pumpkinBlurTexPath`
- `protected java.util.Random rand`
- `protected boolean recordIsPlaying`
- `protected java.lang.String recordPlaying`
- `protected int recordPlayingUpFor`
- `protected int remainingHighlightTicks`
- `protected int updateCounter`
- `protected static ResourceLocation vignetteTexPath`
- `protected static ResourceLocation widgetsTexPath`
