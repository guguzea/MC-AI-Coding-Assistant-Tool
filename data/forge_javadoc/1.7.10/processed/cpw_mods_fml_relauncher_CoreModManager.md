# CoreModManager

**Inheritance:** java.lang.Object → cpw.mods.fml.relauncher.CoreModManager

## Class signature

```java
public class CoreModManager extends java.lang.Object
```

## Constructors

- `CoreModManager()`

## Methods

- `static java.util.List<java.lang.String> getAccessTransformers()`
- `static java.util.List<java.lang.String> getLoadedCoremods()`
- `static java.util.List<java.lang.String> getReparseableCoremods()`
- `static void handleLaunch(java.io.File mcDir, LaunchClassLoader classLoader, FMLTweaker tweaker)`
- `static void injectCoreModTweaks(FMLInjectionAndSortingTweaker fmlInjectionAndSortingTweaker)`
- `static void injectTransformers(LaunchClassLoader classLoader)`
- `static void sortTweakList()`