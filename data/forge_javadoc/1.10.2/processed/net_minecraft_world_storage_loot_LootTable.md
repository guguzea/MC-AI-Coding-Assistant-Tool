# LootTable

## Class signature

```java
public class LootTable extends java.lang.Object
```

## Constructors

- `public LootTable( LootPool [] poolsIn)`

## Methods

- `public java.util.List< ItemStack > generateLootForPools(java.util.Random rand, LootContext context)`
- `public void fillInventory( IInventory inventory, java.util.Random rand, LootContext context)`
- `public void freeze()`
- `public boolean isFrozen()`
- `public LootPool getPool(java.lang.String name)`
- `public LootPool removePool(java.lang.String name)`
- `public void addPool( LootPool pool)`