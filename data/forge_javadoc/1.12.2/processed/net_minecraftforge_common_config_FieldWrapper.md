# FieldWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.common.config.FieldWrapper

## Class signature

```java
public abstract class FieldWrapper extends java.lang.Object implements IFieldWrapper
```

## Constructors

- `FieldWrapper(java.lang.String category, java.lang.reflect.Field field, java.lang.Object instance)`

## Methods

- `static IFieldWrapper get(java.lang.Object instance, java.lang.reflect.Field field, java.lang.String category)`
- `static boolean hasWrapperFor(java.lang.reflect.Field field)`

## Fields

- `protected java.lang.String category`
- `protected java.lang.reflect.Field field`
- `protected java.lang.Object instance`
- `protected java.lang.String name`