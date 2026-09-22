# JsonSerializableSet

**Inheritance:** java.lang.Object → com.google.common.collect.ForwardingObject → com.google.common.collect.ForwardingCollection<E> → com.google.common.collect.ForwardingSet<java.lang.String> → net.minecraft.util.JsonSerializableSet

## Class signature

```java
public class JsonSerializableSet extends com.google.common.collect.ForwardingSet<java.lang.String> implements IJsonSerializable
```

## Constructors

- `JsonSerializableSet()`

## Methods

- `protected java.util.Set<java.lang.String> delegate()`
- `void fromJson(com.google.gson.JsonElement json)`
- `com.google.gson.JsonElement getSerializableElement()`