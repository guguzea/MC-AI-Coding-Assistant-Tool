# EntityMinecartMobSpawner

## Class signature

```java
public class EntityMinecartMobSpawner extends EntityMinecart
```

## Constructors

- `public EntityMinecartMobSpawner( World worldIn)`
- `public EntityMinecartMobSpawner( World worldIn, double x, double y, double z)`

## Methods

- `public static void registerFixesMinecartMobSpawner( DataFixer fixer)`
- `public EntityMinecart.Type getType()`
- `public IBlockState getDefaultDisplayTile()`
- `protected void readEntityFromNBT( NBTTagCompound compound)`
- `protected void writeEntityToNBT( NBTTagCompound compound)`
- `public void handleStatusUpdate(byte id)`
- `public void onUpdate()`