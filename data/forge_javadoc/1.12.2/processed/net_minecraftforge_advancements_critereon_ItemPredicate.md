# ItemPredicate

## Class signature

```java
public class ItemPredicate extends java.lang.Object
```

## Constructors

- `public ItemPredicate()`
- `public ItemPredicate( Item item, java.lang.Integer data, MinMaxBounds count, MinMaxBounds durability, EnchantmentPredicate [] enchantments, PotionType potion, NBTPredicate nbt)`

## Methods

- `public boolean test( ItemStack item)`
- `public static ItemPredicate deserialize(JsonElement element)`
- `public static ItemPredicate [] deserializeArray(JsonElement element)`