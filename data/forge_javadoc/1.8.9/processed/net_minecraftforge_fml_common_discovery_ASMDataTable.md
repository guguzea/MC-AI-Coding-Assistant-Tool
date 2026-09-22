# ASMDataTable

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.discovery.ASMDataTable

## Class signature

```java
public class ASMDataTable extends java.lang.Object
```

## Constructors

- `ASMDataTable()`

## Methods

- `void addASMData(ModCandidate candidate, java.lang.String annotation, java.lang.String className, java.lang.String objectName, java.util.Map<java.lang.String, java.lang.Object> annotationInfo)`
- `void addContainer(ModContainer container)`
- `java.util.Set<ASMDataTable.ASMData> getAll(java.lang.String annotation)`
- `<any> getAnnotationsFor(ModContainer container)`
- `java.util.Set<ModCandidate> getCandidatesFor(java.lang.String pkg)`
- `void registerPackage(ModCandidate modCandidate, java.lang.String pkg)`