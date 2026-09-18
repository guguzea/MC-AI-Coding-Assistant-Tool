# LootEntryItem

## Class signature

```java
public class LootEntryItem extends LootEntry
```

## Constructors

- `public LootEntryItem( Item itemIn, int weightIn, int qualityIn, LootFunction [] functionsIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `public void addLoot(java.util.Collection< ItemStack > stacks, java.util.Random rand, LootContext context)`
- `protected void serialize(JsonObject json, JsonSerializationContext context)`
- `public static LootEntryItem deserialize(JsonObject object, JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`