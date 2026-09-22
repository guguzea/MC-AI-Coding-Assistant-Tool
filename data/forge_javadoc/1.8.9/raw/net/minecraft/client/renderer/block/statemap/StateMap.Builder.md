---
title: "StateMap.Builder"
description: "public static class StateMap.Builder extends java.lang.Object"
package: "net/minecraft/client/renderer/block/statemap"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/block/statemap/StateMap.Builder.html"
sourceType: javadoc
---

# StateMap.Builder

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.statemap.StateMap.Builder

## Class signature

```java
public static class StateMap.Builder extends java.lang.Object
```

## Constructors

- `Builder()`

## Methods

- `StateMap build()`
- `StateMap.Builder ignore(IProperty<?>... p_178442_1_)` — Add properties that will not be used to compute all possible states of a block, used for block rendering to ignore some property that does not alter block's appearance
- `StateMap.Builder withName(IProperty<?> builderPropertyIn)`
- `StateMap.Builder withSuffix(java.lang.String builderSuffixIn)`
