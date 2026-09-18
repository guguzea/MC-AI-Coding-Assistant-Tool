# LootEntryEmpty

## Class signature

```java
public class LootEntryEmpty extends LootEntry
```

## Constructors

- `public LootEntryEmpty(int weightIn, int qualityIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `public void addLoot(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `protected void serialize(JsonObject json, JsonSerializationContext context)`
- `public static LootEntryEmpty deserialize(JsonObject object, JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`