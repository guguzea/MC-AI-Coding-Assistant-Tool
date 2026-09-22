# ModAPIManager

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.ModAPIManager

## Class signature

```java
public class ModAPIManager extends java.lang.Object
```

## Constructors

- `ModAPIManager()`

## Methods

- `void cleanupAPIContainers(java.util.List<ModContainer> mods)`
- `java.lang.Iterable<? extends ModContainer> getAPIList()`
- `boolean hasAPI(java.lang.String modId)`
- `void injectAPIModContainers(java.util.List<ModContainer> mods, java.util.Map<java.lang.String, ModContainer> nameLookup)`
- `void manageAPI(ModClassLoader modClassLoader, ModDiscoverer discoverer)`
- `void registerDataTableAndParseAPI(ASMDataTable dataTable)`

## Fields

- `static ModAPIManager INSTANCE`