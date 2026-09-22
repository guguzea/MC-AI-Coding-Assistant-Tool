# TimeValues.CommonTimeValueTypeAdapterFactory

**Inheritance:** java.lang.Object → java.lang.Enum<TimeValues.CommonTimeValueTypeAdapterFactory> → net.minecraftforge.common.animation.TimeValues.CommonTimeValueTypeAdapterFactory

## Class signature

```java
public static enum TimeValues.CommonTimeValueTypeAdapterFactory extends java.lang.Enum<TimeValues.CommonTimeValueTypeAdapterFactory> implements com.google.gson.TypeAdapterFactory
```

## Methods

- `<T> com.google.gson.TypeAdapter<T> create(com.google.gson.Gson gson, com.google.gson.reflect.TypeToken<T> type)`
- `void setValueResolver(com.google.common.base.Function<java.lang.String, ITimeValue> valueResolver)`
- `static TimeValues.CommonTimeValueTypeAdapterFactory valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static TimeValues.CommonTimeValueTypeAdapterFactory [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.