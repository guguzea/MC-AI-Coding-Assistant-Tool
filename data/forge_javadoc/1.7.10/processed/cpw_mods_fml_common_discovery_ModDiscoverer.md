# ModDiscoverer

**Inheritance:** java.lang.Object → cpw.mods.fml.common.discovery.ModDiscoverer

## Class signature

```java
public class ModDiscoverer extends java.lang.Object
```

## Constructors

- `ModDiscoverer()`

## Methods

- `void findClasspathMods(ModClassLoader modClassLoader)`
- `void findModDirMods(java.io.File modsDir)`
- `void findModDirMods(java.io.File modsDir, java.io.File[] supplementalModFileCandidates)`
- `ASMDataTable getASMTable()`
- `java.util.List<java.io.File> getNonModLibs()`
- `java.util.List<ModContainer> identifyMods()`