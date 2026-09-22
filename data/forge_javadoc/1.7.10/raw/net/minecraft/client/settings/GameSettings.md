---
title: "GameSettings"
description: "public class GameSettings extends java.lang.Object"
package: "net/minecraft/client/settings"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/settings/GameSettings.html"
sourceType: javadoc
---

# GameSettings

**Inheritance:** java.lang.Object → net.minecraft.client.settings.GameSettings

## Class signature

```java
public class GameSettings extends java.lang.Object
```

## Constructors

- `GameSettings()`
- `GameSettings(Minecraft p_i1016_1_, java.io.File p_i1016_2_)`

## Methods

- `java.lang.String getKeyBinding(GameSettings.Options p_74297_1_)`
- `static java.lang.String getKeyDisplayString(int p_74298_0_)`
- `float getOptionFloatValue(GameSettings.Options p_74296_1_)`
- `boolean getOptionOrdinalValue(GameSettings.Options p_74308_1_)`
- `float getSoundLevel(SoundCategory p_151438_1_)`
- `static boolean isKeyDown(KeyBinding p_100015_0_)`
- `void loadOptions()`
- `void saveOptions()`
- `void sendSettingsToServer()`
- `void setOptionFloatValue(GameSettings.Options p_74304_1_, float p_74304_2_)`
- `void setOptionKeyBinding(KeyBinding p_151440_1_, int p_151440_2_)`
- `void setOptionValue(GameSettings.Options p_74306_1_, int p_74306_2_)`
- `void setSoundLevel(SoundCategory p_151439_1_, float p_151439_2_)`
- `boolean shouldRenderClouds()`

## Fields

- `boolean advancedItemTooltips`
- `boolean advancedOpengl`
- `int ambientOcclusion`
- `boolean anaglyph`
- `int anisotropicFiltering`
- `boolean chatColours`
- `float chatHeightFocused`
- `float chatHeightUnfocused`
- `boolean chatLinks`
- `boolean chatLinksPrompt`
- `float chatOpacity`
- `float chatScale`
- `EntityPlayer.EnumChatVisibility chatVisibility`
- `float chatWidth`
- `boolean clouds`
- `boolean debugCamEnable`
- `float debugCamRate`
- `EnumDifficulty difficulty`
- `boolean enableVsync`
- `boolean fancyGraphics`
- `boolean fboEnable`
- `KeyBinding field_152395_am`
- `KeyBinding field_152396_an`
- `KeyBinding field_152397_ao`
- `KeyBinding field_152398_ap`
- `KeyBinding field_152399_aq`
- `float field_152400_J`
- `float field_152401_K`
- `float field_152402_L`
- `float field_152403_M`
- `float field_152404_N`
- `int field_152405_O`
- `boolean field_152406_P`
- `java.lang.String field_152407_Q`
- `int field_152408_R`
- `int field_152409_S`
- `int field_152410_T`
- `boolean forceUnicodeFont`
- `float fovSetting`
- `boolean fullScreen`
- `float gammaSetting`
- `int guiScale`
- `boolean heldItemTooltips`
- `boolean hideGUI`
- `boolean hideServerAddress`
- `boolean invertMouse`
- `KeyBinding keyBindAttack`
- `KeyBinding keyBindBack`
- `KeyBinding keyBindChat`
- `KeyBinding keyBindCommand`
- `KeyBinding keyBindDrop`
- `KeyBinding keyBindForward`
- `KeyBinding [] keyBindings`
- `KeyBinding keyBindInventory`
- `KeyBinding keyBindJump`
- `KeyBinding keyBindLeft`
- `KeyBinding keyBindPickBlock`
- `KeyBinding keyBindPlayerList`
- `KeyBinding keyBindRight`
- `KeyBinding keyBindScreenshot`
- `KeyBinding [] keyBindsHotbar`
- `KeyBinding keyBindSmoothCamera`
- `KeyBinding keyBindSneak`
- `KeyBinding keyBindSprint`
- `KeyBinding keyBindTogglePerspective`
- `KeyBinding keyBindUseItem`
- `java.lang.String language`
- `java.lang.String lastServer`
- `int limitFramerate`
- `protected Minecraft mc`
- `int mipmapLevels`
- `float mouseSensitivity`
- `boolean noclip`
- `float noclipRate`
- `int overrideHeight`
- `int overrideWidth`
- `int particleSetting`
- `boolean pauseOnLostFocus`
- `int renderDistanceChunks`
- `java.util.List resourcePacks`
- `float saturation`
- `boolean showCape`
- `boolean showDebugInfo`
- `boolean showDebugProfilerChart`
- `boolean showInventoryAchievementHint`
- `boolean smoothCamera`
- `boolean snooperEnabled`
- `int thirdPersonView`
- `boolean touchscreen`
- `boolean viewBobbing`
