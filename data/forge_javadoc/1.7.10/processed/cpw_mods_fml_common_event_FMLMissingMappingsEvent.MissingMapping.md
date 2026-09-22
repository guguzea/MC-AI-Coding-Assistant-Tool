# FMLMissingMappingsEvent.MissingMapping

**Inheritance:** java.lang.Object → cpw.mods.fml.common.event.FMLMissingMappingsEvent.MissingMapping

## Class signature

```java
public static class FMLMissingMappingsEvent.MissingMapping extends java.lang.Object
```

## Constructors

- `MissingMapping(java.lang.String name, int id)`

## Methods

- `void fail()` — Prevent the world from loading due to the missing item.
- `FMLMissingMappingsEvent.Action getAction()`
- `java.lang.Object getTarget()`
- `void ignore()` — Ignore the missing item.
- `void remap(Block target)` — Remap the missing item to the specified Block.
- `void remap(Item target)` — Remap the missing item to the specified Item.
- `@Deprecated void setAction(FMLMissingMappingsEvent.Action target)` — Deprecated. use ignore(), warn(), fail() or remap() instead
- `void skipItemBlock()`
- `void warn()` — Warn the user about the missing item.

## Fields

- `int id`
- `java.lang.String name`
- `GameRegistry.Type type`