---
title: "RegistryDelegate.Delegate"
description: "public static final class RegistryDelegate.Delegate<T> extends java.lang.Object implements RegistryDelegate<T>"
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/registry/RegistryDelegate.Delegate.html"
sourceType: javadoc
---

# RegistryDelegate.Delegate

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.RegistryDelegate.Delegate<T>

## Class signature

```java
public static final class RegistryDelegate.Delegate<T> extends java.lang.Object implements RegistryDelegate<T>
```

## Constructors

- `Delegate(T referant, java.lang.Class<T> type)`

## Methods

- `boolean equals(java.lang.Object obj)`
- `T get()` — Get the referent pointed at by this delegate.
- `ResourceLocation getResourceName()` — Get the unique resource location for this delegate.
- `int hashCode()`
- `java.lang.String name()` — Get the name of this delegate.
- `java.lang.Class<T> type()` — Get the delegate type.
