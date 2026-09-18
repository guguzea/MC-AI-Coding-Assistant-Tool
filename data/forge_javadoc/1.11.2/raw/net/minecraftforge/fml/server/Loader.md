---
title: "Loader"
description: "The loader class performs the actual loading of the mod code from disk. There are several LoaderState s to mod loading, triggered in two different stages from the FML handler code's hooks into the min"
package: "net/minecraftforge/fml/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/Loader.html"
sourceType: javadoc
---

# Loader

## Class signature

```java
public class Loader extends java.lang.Object
```

## Methods

- `public static Loader instance()`
- `public static void injectData(java.lang.Object... data)`
- `public java.util.List< ModContainer > getModList()`
- `public void setupTestHarness( ModContainer ... containers)`
- `public void loadMods(java.util.List<java.lang.String> injectedModContainers)`
- `public void preinitializeMods()`
- `public static boolean isModLoaded(java.lang.String modname)`
- `public java.io.File getConfigDir()`
- `public java.lang.String getCrashInformation()`
- `public java.lang.String getFMLVersionString()`
- `public ModClassLoader getModClassLoader()`
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
- `public com.google.common.collect.BiMap< ModContainer ,java.lang.Object> getModObjectList()`
- `public com.google.common.collect.BiMap<java.lang.Object, ModContainer > getReversedModObjectList()`
- `@Nullable public ModContainer activeModContainer()`
- `public boolean isInState( LoaderState state)`
- `public MinecraftDummyContainer getMinecraftModContainer()`
- `public boolean hasReachedState( LoaderState state)`
- `public java.lang.String getMCPVersionString()`
- `public void serverStopped()`
- `public boolean serverAboutToStart(java.lang.Object server)`
- `public java.util.Map<java.lang.String,java.lang.String> getFMLBrandingProperties()`
- `public java.util.Map<java.lang.String,java.lang.String> getCustomModProperties(java.lang.String modId)`
- `public java.util.List<java.lang.String> fireMissingMappingEvent(java.util.Map< ResourceLocation ,java.lang.Integer> missingBlocks, java.util.Map< ResourceLocation ,java.lang.Integer> missingItems, boolean isLocalWorld, java.util.Map< ResourceLocation ,java.lang.Integer[]> remapBlocks, java.util.Map< ResourceLocation ,java.lang.Integer[]> remapItems)`
- `public void fireRemapEvent(java.util.Map< ResourceLocation ,java.lang.Integer[]> remapBlocks, java.util.Map< ResourceLocation ,java.lang.Integer[]> remapItems, boolean isFreezing)`
- `public void runtimeDisableMod(java.lang.String modId)`
- `public void loadingComplete()`
- `public final LoaderState getLoaderState()`
- `public void setActiveModContainer(@Nullable ModContainer container)`

## Description

The loader class performs the actual loading of the mod code from disk. There are several LoaderState s to mod loading, triggered in two different stages from the FML handler code's hooks into the min
