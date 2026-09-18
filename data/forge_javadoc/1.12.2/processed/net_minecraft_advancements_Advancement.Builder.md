# Advancement.Builder

## Methods

- `public boolean resolveParent(java.util.function.Function< ResourceLocation , Advancement > lookup)`
- `public Advancement build( ResourceLocation id)`
- `public void writeTo( PacketBuffer buf)`
- `public java.lang.String toString()`
- `public static Advancement.Builder deserialize(JsonObject json, JsonDeserializationContext context)`
- `public static Advancement.Builder readFrom( PacketBuffer buf) throws java.io.IOException`