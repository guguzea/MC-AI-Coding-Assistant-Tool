# ConfigChangedEvent

## Class signature

```java
public class ConfigChangedEvent extends Event
```

## Constructors

- `public ConfigChangedEvent(java.lang.String modID, @Nullable java.lang.String configID, boolean isWorldRunning, boolean requiresMcRestart)`

## Methods

- `public java.lang.String getModID()`
- `public boolean isWorldRunning()`
- `public boolean isRequiresMcRestart()`
- `@Nullable public java.lang.String getConfigID()`

## Description

These events are posted from the GuiConfig screen when the done button is pressed. The events are only posted if the parent screen is not an instance of GuiConfig or if the configID field has been set