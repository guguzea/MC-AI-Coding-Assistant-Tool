---
title: "HttpUtil"
description: "public class HttpUtil extends java.lang.Object"
package: "net/minecraft/util"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/util/HttpUtil.html"
sourceType: javadoc
---

# HttpUtil

**Inheritance:** java.lang.Object → net.minecraft.util.HttpUtil

## Class signature

```java
public class HttpUtil extends java.lang.Object
```

## Constructors

- `HttpUtil()`

## Methods

- `static java.lang.String buildPostString(java.util.Map<java.lang.String, java.lang.Object> data)`
- `static com.google.common.util.concurrent.ListenableFuture<java.lang.Object> downloadResourcePack(java.io.File saveFile, java.lang.String packUrl, java.util.Map<java.lang.String, java.lang.String> p_180192_2_, int maxSize, IProgressUpdate p_180192_4_, java.net.Proxy p_180192_5_)`
- `static int getSuitableLanPort()`
- `static java.lang.String postMap(java.net.URL url, java.util.Map<java.lang.String, java.lang.Object> data, boolean skipLoggingErrors, java.net.Proxy p_151226_3_)`

## Fields

- `static com.google.common.util.concurrent.ListeningExecutorService DOWNLOADER_EXECUTOR`
