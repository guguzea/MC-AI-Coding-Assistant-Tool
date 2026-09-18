# EntityPropertyManager

## Class signature

```java
public class EntityPropertyManager extends java.lang.Object
```

## Constructors

- `public EntityPropertyManager()`

## Methods

- `public static <T extends EntityProperty > void registerProperty( EntityProperty.Serializer <? extends T> serializer)`
- `public static EntityProperty.Serializer <?> getSerializerForName( ResourceLocation name)`
- `public static <T extends EntityProperty > EntityProperty.Serializer <T> getSerializerFor(T property)`