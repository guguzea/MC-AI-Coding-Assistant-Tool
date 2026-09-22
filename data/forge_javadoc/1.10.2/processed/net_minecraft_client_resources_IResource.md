# IResource

## Class signature

```java
public interface IResource extends java.io.Closeable
```

## Methods

- `java.io.InputStream getInputStream()`
- `<T extends IMetadataSection> T getMetadata(java.lang.String sectionName)`
- `ResourceLocation getResourceLocation()`
- `java.lang.String getResourcePackName()`
- `boolean hasMetadata()`