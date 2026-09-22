---
title: "JsonException"
description: "public class JsonException extends java.io.IOException"
package: "net/minecraft/client/util"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/util/JsonException.html"
sourceType: javadoc
---

# JsonException

**Inheritance:** java.lang.Object → java.lang.Throwable → java.lang.Exception → java.io.IOException → net.minecraft.client.util.JsonException

## Class signature

```java
public class JsonException extends java.io.IOException
```

## Constructors

- `JsonException(java.lang.String messageIn)`
- `JsonException(java.lang.String messageIn, java.lang.Throwable cause)`

## Methods

- `static JsonException forException(java.lang.Exception exception)`
- `java.lang.String getMessage()`
- `void prependJsonKey(java.lang.String key)`
- `void setFilenameAndFlush(java.lang.String filenameIn)`
