# ModelBlock.Deserializer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.ModelBlock.Deserializer

## Class signature

```java
public static class ModelBlock.Deserializer extends java.lang.Object implements com.google.gson.JsonDeserializer<ModelBlock>
```

## Constructors

- `Deserializer()`

## Methods

- `ModelBlock deserialize(com.google.gson.JsonElement p_deserialize_1_, java.lang.reflect.Type p_deserialize_2_, com.google.gson.JsonDeserializationContext p_deserialize_3_)`
- `protected boolean getAmbientOcclusionEnabled(com.google.gson.JsonObject object)`
- `protected java.util.List<ItemOverride> getItemOverrides(com.google.gson.JsonDeserializationContext deserializationContext, com.google.gson.JsonObject object)`
- `protected java.util.List<BlockPart> getModelElements(com.google.gson.JsonDeserializationContext deserializationContext, com.google.gson.JsonObject object)`