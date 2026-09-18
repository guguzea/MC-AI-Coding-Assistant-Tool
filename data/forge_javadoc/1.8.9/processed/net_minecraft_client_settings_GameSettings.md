# GameSettings

## Class signature

```java
public class GameSettings extends java.lang.Object
```

## Constructors

- `public GameSettings( Minecraft mcIn, java.io.File p_i46326_2_)`
- `public GameSettings()`

## Methods

- `public static java.lang.String getKeyDisplayString(int p_74298_0_)`
- `public static boolean isKeyDown( KeyBinding p_100015_0_)`
- `public void setOptionKeyBinding( KeyBinding p_151440_1_, int p_151440_2_)`
- `public void setOptionFloatValue( GameSettings.Options p_74304_1_, float p_74304_2_)`
- `public void setOptionValue( GameSettings.Options p_74306_1_, int p_74306_2_)`
- `public float getOptionFloatValue( GameSettings.Options p_74296_1_)`
- `public boolean getOptionOrdinalValue( GameSettings.Options p_74308_1_)`
- `public java.lang.String getKeyBinding( GameSettings.Options p_74297_1_)`
- `public void loadOptions()`
- `public void saveOptions()`
- `public float getSoundLevel( SoundCategory p_151438_1_)`
- `public void setSoundLevel( SoundCategory p_151439_1_, float p_151439_2_)`
- `public void sendSettingsToServer()`
- `public java.util.Set< EnumPlayerModelParts > getModelParts()`
- `public void setModelPartEnabled( EnumPlayerModelParts p_178878_1_, boolean p_178878_2_)`
- `public void switchModelPartEnabled( EnumPlayerModelParts p_178877_1_)`
- `public int func_181147_e()`
- `public boolean func_181148_f()`

## Description

Whether to show advanced information on item tooltips, toggled by F3+H