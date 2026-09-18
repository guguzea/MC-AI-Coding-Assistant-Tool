# ItemModelMesher

## Class signature

```java
public class ItemModelMesher extends java.lang.Object
```

## Constructors

- `public ItemModelMesher( ModelManager modelManager)`

## Methods

- `public TextureAtlasSprite getParticleIcon( Item item)`
- `public TextureAtlasSprite getParticleIcon( Item item, int meta)`
- `public IBakedModel getItemModel( ItemStack stack)`
- `protected int getMetadata( ItemStack stack)`
- `protected IBakedModel getItemModel( Item item, int meta)`
- `public void register( Item item, int meta, ModelResourceLocation location)`
- `public void register( Item item, ItemMeshDefinition definition)`
- `public ModelManager getModelManager()`
- `public void rebuildCache()`