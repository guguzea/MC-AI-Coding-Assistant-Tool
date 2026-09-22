# LootEntryTable

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.LootEntry → net.minecraft.world.storage.loot.LootEntryTable

## Class signature

```java
public class LootEntryTable extends LootEntry
```

## Constructors

- `LootEntryTable(ResourceLocation tableIn, int weightIn, int qualityIn, LootCondition [] conditionsIn, java.lang.String entryName)`

## Methods

- `void addLoot(java.util.Collection<ItemStack> stacks, java.util.Random rand, LootContext context)`
- `static LootEntryTable deserialize(com.google.gson.JsonObject object, com.google.gson.JsonDeserializationContext deserializationContext, int weightIn, int qualityIn, LootCondition [] conditionsIn)`
- `protected void serialize(com.google.gson.JsonObject json, com.google.gson.JsonSerializationContext context)`

## Fields

- `protected ResourceLocation table`