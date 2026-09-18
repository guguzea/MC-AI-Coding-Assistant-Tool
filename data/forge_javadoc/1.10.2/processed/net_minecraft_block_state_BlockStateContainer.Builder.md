# BlockStateContainer.Builder

## Constructors

- `public Builder( Block block)`

## Methods

- `public BlockStateContainer.Builder add( IProperty <?>... props)`
- `public BlockStateContainer.Builder add( IUnlistedProperty <?>... props)`
- `public BlockStateContainer build()`

## Description

Forge added class to make building things easier. Will return an instance of BlockStateContainer appropriate for the list of properties passed in. Example usage: protected BlockStateContainer createBl