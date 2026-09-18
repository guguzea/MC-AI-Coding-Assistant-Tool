# JsonSerializableSet

## Class signature

```java
public class JsonSerializableSet extends com.google.common.collect.ForwardingSet<java.lang.String> implements IJsonSerializable
```

## Constructors

- `public JsonSerializableSet()`

## Methods

- `public void fromJson(com.google.gson.JsonElement json)`
- `public com.google.gson.JsonElement getSerializableElement()`
- `protected java.util.Set<java.lang.String> delegate()`