# ConfigChangedEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.fml.client.event.ConfigChangedEvent

## Class signature

```java
public class ConfigChangedEvent extends Event
```

## Constructors

- `ConfigChangedEvent(java.lang.String modID, java.lang.String configID, boolean isWorldRunning, boolean requiresMcRestart)`

## Methods

- `java.lang.String getConfigID()` — A String identifier for this ConfigChangedEvent.
- `java.lang.String getModID()` — The Mod ID of the mod whose configuration just changed.
- `boolean isRequiresMcRestart()` — Will be set to true if any elements were changed that require a restart of Minecraft.
- `boolean isWorldRunning()` — Whether or not a world is currently running.