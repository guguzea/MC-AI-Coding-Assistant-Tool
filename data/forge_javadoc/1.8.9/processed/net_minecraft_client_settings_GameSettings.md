# GameSettings

**Inheritance:** java.lang.Object → net.minecraft.client.settings.GameSettings

## Class signature

```java
public class GameSettings extends java.lang.Object
```

## Constructors

- `GameSettings()`
- `GameSettings(Minecraft mcIn, java.io.File p_i46326_2_)`

## Methods

- `int func_181147_e()`
- `boolean func_181148_f()`
- `java.lang.String getKeyBinding(GameSettings.Options p_74297_1_)` — Gets a key binding.
- `static java.lang.String getKeyDisplayString(int p_74298_0_)` — Represents a key or mouse button as a string.
- `java.util.Set<EnumPlayerModelParts> getModelParts()`
- `float getOptionFloatValue(GameSettings.Options p_74296_1_)`
- `boolean getOptionOrdinalValue(GameSettings.Options p_74308_1_)`
- `float getSoundLevel(SoundCategory p_151438_1_)`
- `static boolean isKeyDown(KeyBinding p_100015_0_)` — Returns whether the specified key binding is currently being pressed.
- `void loadOptions()` — Loads the options from the options file.
- `void saveOptions()` — Saves the options to the options file.
- `void sendSettingsToServer()` — Send a client info packet with settings information to the server
- `void setModelPartEnabled(EnumPlayerModelParts p_178878_1_, boolean p_178878_2_)`
- `void setOptionFloatValue(GameSettings.Options p_74304_1_, float p_74304_2_)` — If the specified option is controlled by a slider (float value), this will set the float value.
- `void setOptionKeyBinding(KeyBinding p_151440_1_, int p_151440_2_)` — Sets a key binding and then saves all settings.
- `void setOptionValue(GameSettings.Options p_74306_1_, int p_74306_2_)` — For non-float options.
- `void setSoundLevel(SoundCategory p_151439_1_, float p_151439_2_)`
- `void switchModelPartEnabled(EnumPlayerModelParts p_178877_1_)`

## Fields

- `boolean advancedItemTooltips` — Whether to show advanced information on item tooltips, toggled by F3+H
- `boolean allowBlockAlternatives`
- `int ambientOcclusion` — Smooth Lighting
- `boolean anaglyph`
- `boolean chatColours`
- `float chatHeightFocused`
- `float chatHeightUnfocused`
- `boolean chatLinks`
- `boolean chatLinksPrompt`
- `float chatOpacity`
- `float chatScale`
- `EntityPlayer.EnumChatVisibility chatVisibility`
- `float chatWidth`
- `int clouds` — Clouds flag
- `boolean debugCamEnable`
- `EnumDifficulty difficulty`
- `boolean enableVsync`
- `boolean entityShadows`
- `boolean fancyGraphics`
- `boolean fboEnable`
- `boolean field_183509_X`
- `boolean forceUnicodeFont`
- `float fovSetting`
- `boolean fullScreen`
- `float gammaSetting`
- `int guiScale` — GUI scale
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
- `KeyBinding keyBindStreamCommercials`
- `KeyBinding keyBindStreamPauseUnpause`
- `KeyBinding keyBindStreamStartStop`
- `KeyBinding keyBindStreamToggleMic`
- `KeyBinding keyBindTogglePerspective`
- `KeyBinding keyBindUseItem`
- `java.lang.String language` — Game settings language
- `java.lang.String lastServer` — The lastServer string.
- `int limitFramerate`
- `protected Minecraft mc`
- `int mipmapLevels`
- `float mouseSensitivity`
- `int overrideHeight`
- `int overrideWidth`
- `int particleSetting` — Determines amount of particles. 0 = All, 1 = Decreased, 2 = Minimal
- `boolean pauseOnLostFocus` — Whether to pause when the game loses focus, toggled by F3+P
- `boolean reducedDebugInfo`
- `int renderDistanceChunks`
- `java.util.List<java.lang.String> resourcePacks`
- `float saturation`
- `boolean showDebugInfo` — true if debug info should be displayed instead of version
- `boolean showDebugProfilerChart`
- `boolean showInventoryAchievementHint`
- `boolean showLagometer`
- `boolean smoothCamera` — Smooth Camera Toggle
- `boolean snooperEnabled`
- `float streamBytesPerPixel`
- `int streamChatEnabled`
- `int streamChatUserFilter`
- `int streamCompression`
- `float streamFps`
- `float streamGameVolume`
- `float streamKbps`
- `int streamMicToggleBehavior`
- `float streamMicVolume`
- `java.lang.String streamPreferredServer`
- `boolean streamSendMetadata`
- `int thirdPersonView`
- `boolean touchscreen`
- `boolean useNativeTransport`
- `boolean useVbo`
- `boolean viewBobbing`