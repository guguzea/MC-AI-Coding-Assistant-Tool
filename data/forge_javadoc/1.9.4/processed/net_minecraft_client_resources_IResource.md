# IResource

## Class signature

```java
public interface IResource extends java.io.Closeable
```

## Methods

- `ResourceLocation getResourceLocation()`
- `java.io.InputStream getInputStream()`
- `boolean hasMetadata()`
- `@Nullable <T extends IMetadataSection > T getMetadata(java.lang.String sectionName)`
- `java.lang.String getResourcePackName()`