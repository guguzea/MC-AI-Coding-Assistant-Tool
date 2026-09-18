# FMLMissingMappingsEvent

## Class signature

```java
public class FMLMissingMappingsEvent extends FMLEvent
```

## Constructors

- `public FMLMissingMappingsEvent(<any> missingMappings)`

## Methods

- `public void applyModContainer( ModContainer activeContainer)`
- `public java.util.List< FMLMissingMappingsEvent.MissingMapping > get()`
- `public java.util.List< FMLMissingMappingsEvent.MissingMapping > getAll()`

## Description

This event is fired if a world is loaded that has block and item mappings referring the mod that are not in existence. These can be remapped to other existing objects, or simply discarded. Use get() a