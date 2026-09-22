# Clips.CommonClipTypeAdapterFactory

**Inheritance:** java.lang.Object → java.lang.Enum<Clips.CommonClipTypeAdapterFactory> → net.minecraftforge.common.model.animation.Clips.CommonClipTypeAdapterFactory

## Class signature

```java
public static enum Clips.CommonClipTypeAdapterFactory extends java.lang.Enum<Clips.CommonClipTypeAdapterFactory> implements com.google.gson.TypeAdapterFactory
```

## Methods

- `<T> com.google.gson.TypeAdapter<T> create(com.google.gson.Gson gson, com.google.gson.reflect.TypeToken<T> type)`
- `void setClipResolver(com.google.common.base.Function<java.lang.String, IClip> clipResolver)`
- `static Clips.CommonClipTypeAdapterFactory valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static Clips.CommonClipTypeAdapterFactory [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.