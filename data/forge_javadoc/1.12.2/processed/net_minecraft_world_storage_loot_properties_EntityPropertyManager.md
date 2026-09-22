# EntityPropertyManager

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.properties.EntityPropertyManager

## Class signature

```java
public class EntityPropertyManager extends java.lang.Object
```

## Constructors

- `EntityPropertyManager()`

## Methods

- `static<T extends EntityProperty> EntityProperty.Serializer<T> getSerializerFor(T property)`
- `static EntityProperty.Serializer<?> getSerializerForName(ResourceLocation name)`
- `static<T extends EntityProperty> void registerProperty(EntityProperty.Serializer<? extends T> serializer)`