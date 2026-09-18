# IForgeRegistry

## Class signature

```java
public interface IForgeRegistry<V extends IForgeRegistryEntry <V>> extends java.lang.Iterable<V>
```

## Methods

- `java.lang.Class< V > getRegistrySuperType()`
- `void register( V value)`
- `void registerAll( V ... values)`
- `boolean containsKey( ResourceLocation key)`
- `boolean containsValue( V value)`
- `V getValue( ResourceLocation key)`
- `ResourceLocation getKey( V value)`
- `java.util.Set< ResourceLocation > getKeys()`
- `@Deprecated java.util.List< V > getValues()`
- `default java.util.Collection< V > getValuesCollection()`
- `java.util.Set<java.util.Map.Entry< ResourceLocation , V >> getEntries()`
- `<T> T getSlaveMap( ResourceLocation slaveMapName, java.lang.Class<T> type)`

## Description

Main interface for the registry system. Use this to query the registry system.