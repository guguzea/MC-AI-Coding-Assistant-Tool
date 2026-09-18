# DimensionType

## Class signature

```java
public enum DimensionType extends java.lang.Enum< DimensionType >
```

## Methods

- `public static DimensionType [] values()`
- `public static DimensionType valueOf(java.lang.String name)`
- `public int getId()`
- `public java.lang.String getName()`
- `public java.lang.String getSuffix()`
- `public WorldProvider createDimension()`
- `public static DimensionType getById(int id)`
- `public boolean shouldLoadSpawn()`
- `public DimensionType setLoadSpawn(boolean value)`
- `public static DimensionType register(java.lang.String name, java.lang.String suffix, int id, java.lang.Class<? extends WorldProvider > provider, boolean keepLoaded)`

## Description

Returns the enum constant of this type with the specified name.