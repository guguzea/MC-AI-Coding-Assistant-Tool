# ConfigChangedEvent

**Inheritance:** java.lang.Object → cpw.mods.fml.common.eventhandler.Event → cpw.mods.fml.client.event.ConfigChangedEvent

## Class signature

```java
public class ConfigChangedEvent extends Event
```

## Constructors

- `ConfigChangedEvent(java.lang.String modID, java.lang.String configID, boolean isWorldRunning, boolean requiresMcRestart)`

## Fields

- `java.lang.String configID` — A String identifier for this ConfigChangedEvent.
- `boolean isWorldRunning` — Whether or not a world is currently running.
- `java.lang.String modID` — The Mod ID of the mod whose configuration just changed.
- `boolean requiresMcRestart` — Will be set to true if any elements were changed that require a restart of Minecraft.