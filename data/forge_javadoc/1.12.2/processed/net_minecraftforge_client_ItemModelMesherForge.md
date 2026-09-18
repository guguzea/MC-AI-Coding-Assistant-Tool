# ItemModelMesherForge

## Class signature

```java
public class ItemModelMesherForge extends ItemModelMesher
```

## Constructors

- `public ItemModelMesherForge( ModelManager manager)`

## Methods

- `protected IBakedModel getItemModel( Item item, int meta)`
- `public void register( Item item, int meta, ModelResourceLocation location)`
- `public void rebuildCache()`
- `public ModelResourceLocation getLocation( ItemStack stack)`

## Description

Wrapper around ItemModeMesher that cleans up the internal maps to respect ID remapping.