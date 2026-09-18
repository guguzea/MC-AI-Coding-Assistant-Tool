# FileResourcePack

## Class signature

```java
public class FileResourcePack extends AbstractResourcePack implements java.io.Closeable
```

## Constructors

- `public FileResourcePack(java.io.File resourcePackFileIn)`

## Methods

- `protected java.io.InputStream getInputStreamByName(java.lang.String name) throws java.io.IOException`
- `public boolean hasResourceName(java.lang.String name)`
- `public java.util.Set<java.lang.String> getResourceDomains()`
- `protected void finalize() throws java.lang.Throwable`
- `public void close() throws java.io.IOException`