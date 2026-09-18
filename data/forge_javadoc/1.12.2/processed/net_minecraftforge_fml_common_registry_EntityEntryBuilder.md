# EntityEntryBuilder

## Class signature

```java
public final class EntityEntryBuilder<E extends Entity > extends java.lang.Object
```

## Methods

- `public static <E extends Entity > EntityEntryBuilder <E> create()`
- `public final EntityEntryBuilder < E > entity(java.lang.Class<? extends E > entity)`
- `public final EntityEntryBuilder < E > factory(java.util.function.Function< World , E > factory)`
- `public final EntityEntryBuilder < E > id( ResourceLocation id, int network)`
- `public final EntityEntryBuilder < E > id(java.lang.String id, int network)`
- `public final EntityEntryBuilder < E > name(java.lang.String name)`
- `public final EntityEntryBuilder < E > tracker(int range, int updateFrequency, boolean sendVelocityUpdates)`
- `public final EntityEntryBuilder < E > spawn( EnumCreatureType type, int weight, int min, int max, Biome ... biomes)`
- `public final EntityEntryBuilder < E > spawn( EnumCreatureType type, int weight, int min, int max, java.lang.Iterable< Biome > biomes)`
- `public final EntityEntryBuilder < E > egg(int primaryColor, int secondaryColor)`
- `public EntityEntry build()`

## Description

An entity registry entry builder.