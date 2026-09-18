# CoreModManager

## Class signature

```java
public class CoreModManager extends java.lang.Object
```

## Constructors

- `public CoreModManager()`

## Methods

- `public static void handleLaunch(java.io.File mcDir, LaunchClassLoader classLoader, FMLTweaker tweaker)`
- `public static java.util.List<java.lang.String> getIgnoredMods()`
- `public static java.util.Map<java.lang.String,java.util.List<java.lang.String>> getTransformers()`
- `public static java.util.List<java.lang.String> getReparseableCoremods()`
- `public static void injectTransformers(LaunchClassLoader classLoader)`
- `public static void injectCoreModTweaks( FMLInjectionAndSortingTweaker fmlInjectionAndSortingTweaker)`
- `public static void sortTweakList()`
- `public static java.util.List<java.lang.String> getAccessTransformers()`
- `public static void onCrash(java.lang.StringBuilder builder)`