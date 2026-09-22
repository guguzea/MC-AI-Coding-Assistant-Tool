---
title: "IContext"
description: "public interface IContext"
package: "net/minecraftforge/server/permission/context"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/server/permission/context/IContext.html"
sourceType: javadoc
---

# IContext

## Class signature

```java
public interface IContext
```

## Methods

- `<T> T get(ContextKey<T> key)`
- `EntityPlayer getPlayer()`
- `World getWorld()` — World from where permission is requested.
- `boolean has(ContextKey<?> key)`
