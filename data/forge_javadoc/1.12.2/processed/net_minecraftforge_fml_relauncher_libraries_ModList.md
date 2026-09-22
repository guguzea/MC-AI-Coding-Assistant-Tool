# ModList

**Inheritance:** java.lang.Object → net.minecraftforge.fml.relauncher.libraries.ModList

## Class signature

```java
public class ModList extends java.lang.Object
```

## Constructors

- `ModList(Repository repo)`

## Methods

- `void add(Artifact artifact)`
- `boolean changed()`
- `static ModList create(java.io.File json, java.io.File mcdir)`
- `java.util.List<Artifact> flatten()`
- `java.util.List<Artifact> getArtifacts()`
- `static java.util.List<ModList> getBasicLists(java.io.File mcdir)`
- `static java.util.List<ModList> getKnownLists(java.io.File mcdir)`
- `java.lang.Object getName()`
- `Repository getRepository()`
- `void save()`