---
title: "Context"
description: "World from where permission is requested."
package: "net/minecraftforge/server/permission/context"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/server/permission/context/Context.html"
sourceType: javadoc
---

# Context

## Class signature

```java
public class Context extends java.lang.Object implements IContext
```

## Constructors

- `public Context()`

## Methods

- `public World getWorld()`
- `public EntityPlayer getPlayer()`
- `public <T> T get( ContextKey <T> key)`
- `public boolean has( ContextKey <?> key)`
- `public <T> Context set( ContextKey <T> key, T obj)`
- `protected boolean covers( ContextKey <?> key)`

## Description

World from where permission is requested.
