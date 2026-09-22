# FMLMissingMappingsEvent

**Inheritance:** java.lang.Object → cpw.mods.fml.common.event.FMLEvent → cpw.mods.fml.common.event.FMLMissingMappingsEvent

## Class signature

```java
public class FMLMissingMappingsEvent extends FMLEvent
```

## Constructors

- `FMLMissingMappingsEvent(<any> missingMappings)`

## Methods

- `void applyModContainer(ModContainer activeContainer)`
- `java.util.List<FMLMissingMappingsEvent.MissingMapping> get()` — Get the list of missing mappings for the active mod.
- `java.util.List<FMLMissingMappingsEvent.MissingMapping> getAll()` — Get the list of missing mappings for all mods.