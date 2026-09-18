# LootContext

## Class signature

```java
public class LootContext extends java.lang.Object
```

## Constructors

- `public LootContext(float luckIn, WorldServer worldIn, LootTableManager lootTableManagerIn, Entity lootedEntityIn, EntityPlayer playerIn, DamageSource damageSourceIn)`

## Methods

- `public Entity getLootedEntity()`
- `public Entity getKillerPlayer()`
- `public Entity getKiller()`
- `public boolean addLootTable( LootTable lootTableIn)`
- `public void removeLootTable( LootTable lootTableIn)`
- `public LootTableManager getLootTableManager()`
- `public float getLuck()`
- `public Entity getEntity( LootContext.EntityTarget target)`
- `public WorldServer getWorld()`
- `public int getLootingModifier()`