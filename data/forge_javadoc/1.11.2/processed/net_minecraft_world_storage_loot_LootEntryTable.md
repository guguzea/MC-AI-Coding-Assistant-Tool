# LootEntryTable

## Class signature

```java
public class LootEntryTable extends LootEntry
```

## Constructors

- `public LootEntryTable( ResourceLocation tableIn, int weightIn, int qualityIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `public void addLoot(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `protected void serialize(com.google.gson.JsonObject json, com.google.gson.JsonSerializationContext context)`
- `public static LootEntryTable deserialize(com.google.gson.JsonObject object, com.google.gson.JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`