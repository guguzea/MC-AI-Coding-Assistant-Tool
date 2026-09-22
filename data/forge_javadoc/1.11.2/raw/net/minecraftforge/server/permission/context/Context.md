---
title: "Context"
description: "public class Context extends java.lang.Object implements IContext"
package: "net/minecraftforge/server/permission/context"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/server/permission/context/Context.html"
sourceType: javadoc
---

# Context

**Inheritance:** java.lang.Object → net.minecraftforge.server.permission.context.Context

## Class signature

```java
public class Context extends java.lang.Object implements IContext
```

## Constructors

- `Context()`

## Methods

- `protected boolean covers(ContextKey<?> key)`
- `<T> T get(ContextKey<T> key)`
- `EntityPlayer getPlayer()`
- `World getWorld()` — World from where permission is requested.
- `boolean has(ContextKey<?> key)`
- `<T> Context set(ContextKey<T> key, T obj)` — Sets Context object
