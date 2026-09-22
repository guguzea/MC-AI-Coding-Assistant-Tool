---
title: "GameSettings"
description: "public class GameSettings extends java.lang.Object"
package: "net/minecraft/client/settings"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/settings/GameSettings.html"
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
- `GameSettings(Minecraft mcIn, java.io.File optionsFileIn)`

## Methods

- `java.lang.String getKeyBinding(GameSettings.Options settingOption)`
- `static java.lang.String getKeyDisplayString(int key)`
- `java.util.Set<EnumPlayerModelParts> getModelParts()`
- `float getOptionFloatValue(GameSettings.Options settingOption)`
- `boolean getOptionOrdinalValue(GameSettings.Options settingOption)`
- `float getSoundLevel(SoundCategory category)`
- `static boolean isKeyDown(KeyBinding key)`
- `boolean isUsingNativeTransport()`
- `void loadOptions()`
- `void onGuiClosed()`
- `void saveOptions()`
- `void sendSettingsToServer()`
- `void setModelPartEnabled(EnumPlayerModelParts modelPart, boolean enable)`
- `void setOptionFloatValue(GameSettings.Options settingsOption, float value)`
- `void setOptionKeyBinding(KeyBinding key, int keyCode)`
- `void setOptionValue(GameSettings.Options settingsOption, int value)`
- `void setSoundLevel(SoundCategory category, float volume)`
- `int shouldRenderClouds()`
- `void switchModelPartEnabled(EnumPlayerModelParts modelPart)`

## Fields

- `boolean advancedItemTooltips`
- `int ambientOcclusion`
- `boolean anaglyph`
- `int attackIndicator`
- `boolean autoJump`
- `boolean chatColours`
- `float chatHeightFocused`
- `float chatHeightUnfocused`
- `boolean chatLinks`
- `boolean chatLinksPrompt`
- `float chatOpacity`
- `float chatScale`
- `EntityPlayer.EnumChatVisibility chatVisibility`
- `float chatWidth`
- `int clouds`
- `static com.google.common.base.Splitter COLON_SPLITTER`
- `boolean debugCamEnable`
- `EnumDifficulty difficulty`
- `boolean enableVsync`
- `boolean enableWeakAttacks`
- `boolean entityShadows`
- `boolean fancyGraphics`
- `boolean fboEnable`
- `boolean forceUnicodeFont`
- `float fovSetting`
- `boolean fullScreen`
- `float gammaSetting`
- `int guiScale`
- `boolean heldItemTooltips`
- `boolean hideGUI`
- `boolean hideServerAddress`
- `java.util.List<java.lang.String> incompatibleResourcePacks`
- `boolean invertMouse`
- `KeyBinding keyBindAttack`
- `KeyBinding keyBindBack`
- `KeyBinding keyBindChat`
- `KeyBinding keyBindCommand`
- `KeyBinding keyBindDrop`
- `KeyBinding keyBindForward`
- `KeyBinding keyBindFullscreen`
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
- `KeyBinding keyBindSpectatorOutlines`
- `KeyBinding keyBindSprint`
- `KeyBinding keyBindSwapHands`
- `KeyBinding keyBindTogglePerspective`
- `KeyBinding keyBindUseItem`
- `java.lang.String language`
- `java.lang.String lastServer`
- `int limitFramerate`
- `EnumHandSide mainHand`
- `protected Minecraft mc`
- `int mipmapLevels`
- `float mouseSensitivity`
- `int overrideHeight`
- `int overrideWidth`
- `int particleSetting`
- `boolean pauseOnLostFocus`
- `boolean realmsNotifications`
- `boolean reducedDebugInfo`
- `int renderDistanceChunks`
- `java.util.List<java.lang.String> resourcePacks`
- `float saturation`
- `boolean showDebugInfo`
- `boolean showDebugProfilerChart`
- `boolean showInventoryAchievementHint`
- `boolean showLagometer`
- `boolean showSubtitles`
- `boolean smoothCamera`
- `boolean snooperEnabled`
- `int thirdPersonView`
- `boolean touchscreen`
- `boolean useNativeTransport`
- `boolean useVbo`
- `boolean viewBobbing`
