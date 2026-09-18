# ExtendedBlockState.ExtendedStateImplementation

## Constructors

- `protected ExtendedStateImplementation( Block block, <any> properties, <any> unlistedProperties, <any> table, IBlockState clean)`

## Methods

- `public <T extends java.lang.Comparable<T>,V extends T> IBlockState withProperty( IProperty <T> property, V value)`
- `public <V> IExtendedBlockState withProperty( IUnlistedProperty <V> property, V value)`
- `public java.util.Collection< IUnlistedProperty <?>> getUnlistedNames()`
- `public <V> V getValue( IUnlistedProperty <V> property)`
- `public <any> getUnlistedProperties()`
- `public IBlockState getClean()`