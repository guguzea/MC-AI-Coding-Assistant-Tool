# ASMDataTable

## Class signature

```java
public class ASMDataTable extends java.lang.Object
```

## Constructors

- `public ASMDataTable()`

## Methods

- `public com.google.common.collect.SetMultimap<java.lang.String, ASMDataTable.ASMData > getAnnotationsFor( ModContainer container)`
- `public java.util.Set< ASMDataTable.ASMData > getAll(java.lang.String annotation)`
- `public void addASMData( ModCandidate candidate, java.lang.String annotation, java.lang.String className, @Nullable java.lang.String objectName, @Nullable java.util.Map<java.lang.String,java.lang.Object> annotationInfo)`
- `public void addContainer( ModContainer container)`
- `public void registerPackage( ModCandidate modCandidate, java.lang.String pkg)`
- `public java.util.Set< ModCandidate > getCandidatesFor(java.lang.String pkg)`
- `@Nullable public static java.lang.String getOwnerModID(java.util.Set< ASMDataTable.ASMData > mods, ASMDataTable.ASMData targ)`