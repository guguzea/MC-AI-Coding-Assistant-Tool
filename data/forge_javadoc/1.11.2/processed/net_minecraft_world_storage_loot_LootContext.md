# LootContext

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.LootContext

## Class signature

```java
public class LootContext extends java.lang.Object
```

## Constructors

- `LootContext(float luckIn, WorldServer worldIn, LootTableManager lootTableManagerIn, Entity lootedEntityIn, EntityPlayer playerIn, DamageSource damageSourceIn)`

## Methods

- `boolean addLootTable(LootTable lootTableIn)`
- `Entity getEntity(LootContext.EntityTarget target)`
- `Entity getKiller()`
- `Entity getKillerPlayer()`
- `Entity getLootedEntity()`
- `int getLootingModifier()`
- `LootTableManager getLootTableManager()`
- `float getLuck()`
- `WorldServer getWorld()`
- `void removeLootTable(LootTable lootTableIn)`