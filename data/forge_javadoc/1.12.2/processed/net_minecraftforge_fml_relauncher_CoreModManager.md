# CoreModManager

**Inheritance:** java.lang.Object → net.minecraftforge.fml.relauncher.CoreModManager

## Class signature

```java
public class CoreModManager extends java.lang.Object
```

## Constructors

- `CoreModManager()`

## Methods

- `static java.util.List<java.lang.String> getAccessTransformers()`
- `static java.util.List<java.lang.String> getIgnoredMods()`
- `static java.util.List<java.lang.String> getReparseableCoremods()`
- `static java.util.Map<java.lang.String, java.util.List<java.lang.String>> getTransformers()`
- `static void handleLaunch(java.io.File mcDir, LaunchClassLoader classLoader, FMLTweaker tweaker)`
- `static void injectCoreModTweaks(FMLInjectionAndSortingTweaker fmlInjectionAndSortingTweaker)`
- `static void injectTransformers(LaunchClassLoader classLoader)`
- `static void onCrash(java.lang.StringBuilder builder)`
- `static void sortTweakList()`