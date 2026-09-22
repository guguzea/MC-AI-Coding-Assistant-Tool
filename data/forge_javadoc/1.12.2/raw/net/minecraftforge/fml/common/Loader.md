---
title: "Loader"
description: "public class Loader extends java.lang.Object"
package: "net/minecraftforge/fml/common"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/Loader.html"
sourceType: javadoc
---

# Loader

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.Loader

## Class signature

```java
public class Loader extends java.lang.Object
```

## Methods

- `ModContainer activeModContainer()`
- `@Deprecated void computeDependencies(java.lang.String dependencyString, java.util.Set<ArtifactVersion> requirements, java.util.List<ArtifactVersion> dependencies, java.util.List<ArtifactVersion> dependants)` — Deprecated. use DependencyParser.parseDependencies(String)
- `void fireRemapEvent(java.util.Map<ResourceLocation, java.util.Map<ResourceLocation, java.lang.Integer[]>> remaps, boolean isFreezing)`
- `java.util.List<ModContainer> getActiveModList()`
- `ICrashCallable getCallableCrashInformation()`
- `java.io.File getConfigDir()`
- `java.lang.String getCrashInformation()`
- `java.util.Map<java.lang.String, java.lang.String> getCustomModProperties(java.lang.String modId)`
- `java.util.Map<java.lang.String, java.lang.String> getFMLBrandingProperties()`
- `java.lang.String getFMLVersionString()`
- `java.util.Map<java.lang.String, ModContainer> getIndexedModList()`
- `LoaderState getLoaderState()`
- `java.lang.String getMCPVersionString()`
- `java.lang.String getMCVersionString()`
- `MinecraftDummyContainer getMinecraftModContainer()`
- `ModClassLoader getModClassLoader()`
- `java.util.List<ModContainer> getModList()`
- `<any> getModObjectList()`
- `LoaderState.ModState getModState(ModContainer selectedMod)`
- `<any> getReversedModObjectList()`
- `boolean hasReachedState(LoaderState state)`
- `void initializeMods()`
- `static void injectData(java.lang.Object... data)`
- `static Loader instance()`
- `boolean isInState(LoaderState state)`
- `static boolean isModLoaded(java.lang.String modname)` — Query if we know of a mod named modname
- `void loadingComplete()`
- `void loadMods(java.util.List<java.lang.String> injectedModContainers)` — Called from the hook to start mod loading.
- `void preinitializeMods()`
- `void runtimeDisableMod(java.lang.String modId)`
- `boolean serverAboutToStart(java.lang.Object server)`
- `void serverStarted()`
- `boolean serverStarting(java.lang.Object server)`
- `void serverStopped()`
- `void serverStopping()`
- `void setActiveModContainer(ModContainer container)`
- `void setupTestHarness(ModContainer ... containers)` — Used to setup a testharness with a single dummy mod instance for use with various testing hooks

## Fields

- `static java.lang.String MC_VERSION`
