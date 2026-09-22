# DefaultResourcePack

**Inheritance:** java.lang.Object → net.minecraft.client.resources.DefaultResourcePack

## Class signature

```java
public class DefaultResourcePack extends java.lang.Object implements IResourcePack
```

## Constructors

- `DefaultResourcePack(java.util.Map<java.lang.String, java.io.File> mapAssetsIn)`

## Methods

- `java.io.InputStream getInputStream(ResourceLocation location)`
- `java.io.InputStream getInputStreamAssets(ResourceLocation location)`
- `java.awt.image.BufferedImage getPackImage()`
- `<T extends IMetadataSection> T getPackMetadata(IMetadataSerializer p_135058_1_, java.lang.String p_135058_2_)`
- `java.lang.String getPackName()`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `boolean resourceExists(ResourceLocation location)`

## Fields

- `static java.util.Set<java.lang.String> defaultResourceDomains`