# EntityMinecartChest

## Class signature

```java
public class EntityMinecartChest extends EntityMinecartContainer
```

## Constructors

- `public EntityMinecartChest( World worldIn)`
- `public EntityMinecartChest( World worldIn, double x, double y, double z)`

## Methods

- `public static void registerFixesMinecartChest( DataFixer fixer)`
- `public void killMinecart( DamageSource source)`
- `public int getSizeInventory()`
- `public EntityMinecart.Type getType()`
- `public IBlockState getDefaultDisplayTile()`
- `public int getDefaultDisplayTileOffset()`
- `public java.lang.String getGuiID()`
- `public Container createContainer( InventoryPlayer playerInventory, EntityPlayer playerIn)`