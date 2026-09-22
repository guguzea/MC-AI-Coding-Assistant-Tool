# AbstractResourcePack

**Inheritance:** java.lang.Object → net.minecraft.client.resources.AbstractResourcePack

## Class signature

```java
public abstract class AbstractResourcePack extends java.lang.Object implements IResourcePack
```

## Constructors

- `AbstractResourcePack(java.io.File resourcePackFileIn)`

## Methods

- `java.io.InputStream getInputStream(ResourceLocation location)`
- `protected abstract java.io.InputStream getInputStreamByName(java.lang.String name)`
- `java.awt.image.BufferedImage getPackImage()`
- `<T extends IMetadataSection> T getPackMetadata(MetadataSerializer metadataSerializer, java.lang.String metadataSectionName)`
- `java.lang.String getPackName()`
- `protected static java.lang.String getRelativeName(java.io.File p_110595_0_, java.io.File p_110595_1_)`
- `protected abstract boolean hasResourceName(java.lang.String name)`
- `protected void logNameNotLowercase(java.lang.String name)`
- `boolean resourceExists(ResourceLocation location)`

## Fields

- `protected java.io.File resourcePackFile`