# DirectoryDiscoverer

## Class signature

```java
public class DirectoryDiscoverer extends java.lang.Object implements ITypeDiscoverer
```

## Constructors

- `public DirectoryDiscoverer()`

## Methods

- `public java.util.List< ModContainer > discover( ModCandidate candidate, ASMDataTable table)`
- `public void exploreFileSystem(java.lang.String path, java.io.File modDir, java.util.List< ModContainer > harvestedMods, ModCandidate candidate, @Nullable MetadataCollection mc)`