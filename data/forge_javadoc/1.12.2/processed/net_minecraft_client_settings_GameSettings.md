# GameSettings

**Inheritance:** java.lang.Object → net.minecraft.client.settings.GameSettings

## Class signature

```java
public class GameSettings extends java.lang.Object
```

## Constructors

- `GameSettings()`
- `GameSettings(Minecraft mcIn, java.io.File mcDataDir)`

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
- `static Splitter COLON_SPLITTER`
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
- `KeyBinding keyBindAdvancements`
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
- `KeyBinding keyBindLoadToolbar`
- `KeyBinding keyBindPickBlock`
- `KeyBinding keyBindPlayerList`
- `KeyBinding keyBindRight`
- `KeyBinding keyBindSaveToolbar`
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
- `int narrator`
- `static java.lang.String[] NARRATOR_MODES`
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
- `boolean showLagometer`
- `boolean showSubtitles`
- `boolean smoothCamera`
- `boolean snooperEnabled`
- `int thirdPersonView`
- `boolean touchscreen`
- `TutorialSteps tutorialStep`
- `boolean useNativeTransport`
- `boolean useVbo`
- `boolean viewBobbing`