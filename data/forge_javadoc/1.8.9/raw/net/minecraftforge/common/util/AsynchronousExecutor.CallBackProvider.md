---
title: "AsynchronousExecutor.CallBackProvider"
description: "public static interface AsynchronousExecutor.CallBackProvider<P, T, C, E extends java.lang.Throwable> extends java.util.concurrent.ThreadFactory"
package: "net/minecraftforge/common/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/util/AsynchronousExecutor.CallBackProvider.html"
sourceType: javadoc
---

# AsynchronousExecutor.CallBackProvider

## Class signature

```java
public static interface AsynchronousExecutor.CallBackProvider<P, T, C, E extends java.lang.Throwable> extends java.util.concurrent.ThreadFactory
```

## Methods

- `T callStage1(P parameter)` — Normally an asynchronous call, but can be synchronous
- `void callStage2(P parameter, T object)` — Synchronous call
- `void callStage3(P parameter, T object, C callback)` — Synchronous call, called multiple times, once per registered callback
