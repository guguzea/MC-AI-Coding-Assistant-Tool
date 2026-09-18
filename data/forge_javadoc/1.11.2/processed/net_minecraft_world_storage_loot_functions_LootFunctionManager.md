# LootFunctionManager

## Class signature

```java
public class LootFunctionManager extends java.lang.Object
```

## Constructors

- `public LootFunctionManager()`

## Methods

- `public static <T extends LootFunction > void registerFunction( LootFunction.Serializer <? extends T> serializer)`
- `public static LootFunction.Serializer <?> getSerializerForName( ResourceLocation location)`
- `public static <T extends LootFunction > LootFunction.Serializer <T> getSerializerFor(T functionClass)`