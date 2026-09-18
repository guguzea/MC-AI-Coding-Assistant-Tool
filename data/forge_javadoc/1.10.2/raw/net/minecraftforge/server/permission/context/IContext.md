---
title: "IContext"
description: "Use BlockPosContext or PlayerContext when possible"
package: "net/minecraftforge/server/permission/context"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/server/permission/context/IContext.html"
sourceType: javadoc
---

# IContext

## Class signature

```java
public interface IContext
```

## Methods

- `@Nullable World getWorld()`
- `@Nullable EntityPlayer getPlayer()`
- `@Nullable <T> T get( ContextKey <T> key)`
- `boolean has( ContextKey <?> key)`

## Description

Use BlockPosContext or PlayerContext when possible
