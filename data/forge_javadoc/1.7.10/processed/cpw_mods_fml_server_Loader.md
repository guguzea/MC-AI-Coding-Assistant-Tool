# Loader

## Class signature

```java
public class Loader extends java.lang.Object
```

## Methods

- `public static Loader instance()`
- `public static void injectData(java.lang.Object... data)`
- `public java.util.List< ModContainer > getModList()`
- `public void loadMods()`
- `public void preinitializeMods()`
- `public static boolean isModLoaded(java.lang.String modname)`
- `public java.io.File getConfigDir()`
- `public java.lang.String getCrashInformation()`
- `public java.lang.String getFMLVersionString()`
- `public java.lang.ClassLoader getModClassLoader()`
- `public void computeDependencies(java.lang.String dependencyString, java.util.Set< ArtifactVersion > requirements, java.util.List< ArtifactVersion > dependencies, java.util.List< ArtifactVersion > dependants)`
- `public java.util.Map<java.lang.String, ModContainer > getIndexedModList()`
- `public void initializeMods()`
- `public ICrashCallable getCallableCrashInformation()`
- `public java.util.List< ModContainer > getActiveModList()`
- `public LoaderState.ModState getModState( ModContainer selectedMod)`
- `public java.lang.String getMCVersionString()`
- `public boolean serverStarting(java.lang.Object server)`
- `public void serverStarted()`
- `public void serverStopping()`
- `public <any> getModObjectList()`
- `public <any> getReversedModObjectList()`
- `public ModContainer activeModContainer()`
- `public boolean isInState( LoaderState state)`
- `public MinecraftDummyContainer getMinecraftModContainer()`
- `public boolean hasReachedState( LoaderState state)`
- `public java.lang.String getMCPVersionString()`
- `public void serverStopped()`
- `public boolean serverAboutToStart(java.lang.Object server)`
- `public java.util.Map<java.lang.String,java.lang.String> getFMLBrandingProperties()`
- `public java.util.Map<java.lang.String,java.lang.String> getCustomModProperties(java.lang.String modId)`
- `public java.util.List<java.lang.String> fireMissingMappingEvent(java.util.LinkedHashMap<java.lang.String,java.lang.Integer> missing, boolean isLocalWorld, GameData gameData, java.util.Map<java.lang.String,java.lang.Integer[]> remaps)`
- `public void fireRemapEvent(java.util.Map<java.lang.String,java.lang.Integer[]> remaps)`
- `public void runtimeDisableMod(java.lang.String modId)`
- `public void loadingComplete()`
- `public final LoaderState getLoaderState()`

## Description

The loader class performs the actual loading of the mod code from disk. There are several LoaderState s to mod loading, triggered in two different stages from the FML handler code's hooks into the min