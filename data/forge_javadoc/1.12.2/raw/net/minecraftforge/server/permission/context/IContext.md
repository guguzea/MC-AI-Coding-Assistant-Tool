---
title: "IContext"
description: "public interface IContext"
package: "net/minecraftforge/server/permission/context"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/permission/context/IContext.html"
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
