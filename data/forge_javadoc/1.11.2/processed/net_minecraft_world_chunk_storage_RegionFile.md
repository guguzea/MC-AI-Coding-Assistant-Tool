# RegionFile

## Class signature

```java
public class RegionFile extends java.lang.Object
```

## Constructors

- `public RegionFile(java.io.File fileNameIn)`

## Methods

- `public boolean chunkExists(int x, int z)`
- `@Nullable public java.io.DataInputStream getChunkDataInputStream(int x, int z)`
- `@Nullable public java.io.DataOutputStream getChunkDataOutputStream(int x, int z)`
- `protected void write(int x, int z, byte[] data, int length)`
- `public boolean isChunkSaved(int x, int z)`
- `public void close() throws java.io.IOException`