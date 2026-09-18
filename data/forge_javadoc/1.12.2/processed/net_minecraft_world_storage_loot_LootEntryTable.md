# LootEntryTable

## Class signature

```java
public class LootEntryTable extends LootEntry
```

## Constructors

- `public LootEntryTable( ResourceLocation tableIn, int weightIn, int qualityIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `public void addLoot(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `protected void serialize(JsonObject json, JsonSerializationContext context)`
- `public static LootEntryTable deserialize(JsonObject object, JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`