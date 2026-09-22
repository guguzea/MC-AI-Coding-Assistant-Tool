# Advancement.Builder

**Inheritance:** java.lang.Object → net.minecraft.advancements.Advancement.Builder

## Class signature

```java
public static class Advancement.Builder extends java.lang.Object
```

## Methods

- `Advancement build(ResourceLocation id)`
- `static Advancement.Builder deserialize(JsonObject json, JsonDeserializationContext context)`
- `static Advancement.Builder readFrom(PacketBuffer buf)`
- `boolean resolveParent(java.util.function.Function<ResourceLocation, Advancement> lookup)`
- `java.lang.String toString()`
- `void writeTo(PacketBuffer buf)`