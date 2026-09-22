# FileResourcePack

**Inheritance:** java.lang.Object → net.minecraft.client.resources.AbstractResourcePack → net.minecraft.client.resources.FileResourcePack

## Class signature

```java
public class FileResourcePack extends AbstractResourcePack implements java.io.Closeable
```

## Constructors

- `FileResourcePack(java.io.File resourcePackFileIn)`

## Methods

- `void close()`
- `protected void finalize()`
- `protected java.io.InputStream getInputStreamByName(java.lang.String name)`
- `java.util.Set<java.lang.String> getResourceDomains()`
- `boolean hasResourceName(java.lang.String name)`

## Fields

- `static Splitter entryNameSplitter`