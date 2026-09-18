---
title: "HttpUtil"
description: "Builds an encoded HTTP POST content string from a string map"
package: "net/minecraft/util"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/HttpUtil.html"
sourceType: javadoc
---

# HttpUtil

## Class signature

```java
public class HttpUtil extends java.lang.Object
```

## Constructors

- `public HttpUtil()`

## Methods

- `public static java.lang.String buildPostString(java.util.Map<java.lang.String,java.lang.Object> data)`
- `public static java.lang.String postMap(java.net.URL url, java.util.Map<java.lang.String,java.lang.Object> data, boolean skipLoggingErrors)`
- `public static <any> downloadResourcePack(java.io.File saveFile, java.lang.String packUrl, java.util.Map<java.lang.String,java.lang.String> p_180192_2_, int maxSize, IProgressUpdate p_180192_4_, java.net.Proxy p_180192_5_)`
- `public static int getSuitableLanPort() throws java.io.IOException`
- `public static java.lang.String get(java.net.URL url) throws java.io.IOException`

## Description

Builds an encoded HTTP POST content string from a string map
