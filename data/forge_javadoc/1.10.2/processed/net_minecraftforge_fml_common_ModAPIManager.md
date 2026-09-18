# ModAPIManager

## Class signature

```java
public class ModAPIManager extends java.lang.Object
```

## Constructors

- `public ModAPIManager()`

## Methods

- `public void registerDataTableAndParseAPI( ASMDataTable dataTable)`
- `public void manageAPI( ModClassLoader modClassLoader, ModDiscoverer discoverer)`
- `public void injectAPIModContainers(java.util.List< ModContainer > mods, java.util.Map<java.lang.String, ModContainer > nameLookup)`
- `public void cleanupAPIContainers(java.util.List< ModContainer > mods)`
- `public boolean hasAPI(java.lang.String modId)`
- `public java.lang.Iterable<? extends ModContainer > getAPIList()`