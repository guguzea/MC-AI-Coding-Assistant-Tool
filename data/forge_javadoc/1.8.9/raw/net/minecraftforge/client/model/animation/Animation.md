---
title: "Animation"
description: "public enum Animation extends java.lang.Enum<Animation> implements IResourceManagerReloadListener"
package: "net/minecraftforge/client/model/animation"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/animation/Animation.html"
sourceType: javadoc
---

# Animation

**Inheritance:** java.lang.Object → java.lang.Enum<Animation> → net.minecraftforge.client.model.animation.Animation

## Class signature

```java
public enum Animation extends java.lang.Enum<Animation> implements IResourceManagerReloadListener
```

## Methods

- `static float getPartialTickTime()` — Get current partialTickTime.
- `static float getWorldTime(World world)` — Get the global world time for the current tick, in seconds.
- `static float getWorldTime(World world, float tickProgress)` — Get the global world time for the current tick + partial tick progress, in seconds.
- `IAnimationStateMachine load(ResourceLocation location, <any> customParameters)` — Load a new instance if AnimationStateMachine at specified location, with specified custom parameters.
- `ModelBlockAnimation loadVanillaAnimation(ResourceLocation armatureLocation)` — Load armature associated with a vanilla model.
- `void onResourceManagerReload(IResourceManager manager)` — Iternal hook, do not use.
- `static void setClientPartialTickTime(float clientPartialTickTime)` — Iternal hook, do not use.
- `static Animation valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static Animation [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.
