---
title: "GameSettings"
description: "public class GameSettings extends java.lang.Object"
package: "net/minecraft/client/settings"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/settings/GameSettings.html"
sourceType: javadoc
---

# GameSettings

## Class signature

```java
public class GameSettings extends java.lang.Object
```

## Constructors

- `public GameSettings( Minecraft mcIn, java.io.File optionsFileIn)`
- `public GameSettings()`

## Methods

- `public static java.lang.String getKeyDisplayString(int key)`
- `public static boolean isKeyDown( KeyBinding key)`
- `public void setOptionKeyBinding( KeyBinding key, int keyCode)`
- `public void setOptionFloatValue( GameSettings.Options settingsOption, float value)`
- `public void setOptionValue( GameSettings.Options settingsOption, int value)`
- `public float getOptionFloatValue( GameSettings.Options settingOption)`
- `public boolean getOptionOrdinalValue( GameSettings.Options settingOption)`
- `public java.lang.String getKeyBinding( GameSettings.Options settingOption)`
- `public void loadOptions()`
- `public void saveOptions()`
- `public float getSoundLevel( SoundCategory category)`
- `public void setSoundLevel( SoundCategory category, float volume)`
- `public void sendSettingsToServer()`
- `public java.util.Set< EnumPlayerModelParts > getModelParts()`
- `public void setModelPartEnabled( EnumPlayerModelParts modelPart, boolean enable)`
- `public void switchModelPartEnabled( EnumPlayerModelParts modelPart)`
- `public int shouldRenderClouds()`
- `public boolean isUsingNativeTransport()`
