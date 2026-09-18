---
title: "AdvancementList"
description: "public class AdvancementList extends java.lang.Object"
package: "net/minecraft/advancements"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/AdvancementList.html"
sourceType: javadoc
---

# AdvancementList

## Class signature

```java
public class AdvancementList extends java.lang.Object
```

## Constructors

- `public AdvancementList()`

## Methods

- `public void removeAll(java.util.Set< ResourceLocation > ids)`
- `public void loadAdvancements(java.util.Map< ResourceLocation , Advancement.Builder > advancementsIn)`
- `public void clear()`
- `public java.lang.Iterable< Advancement > getRoots()`
- `public java.lang.Iterable< Advancement > getAdvancements()`
- `public Advancement getAdvancement( ResourceLocation id)`
- `public void setListener( AdvancementList.Listener listenerIn)`
