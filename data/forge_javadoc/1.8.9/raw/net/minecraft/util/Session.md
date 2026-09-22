---
title: "Session"
description: "public class Session extends java.lang.Object"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/Session.html"
sourceType: javadoc
---

# Session

**Inheritance:** java.lang.Object → net.minecraft.util.Session

## Class signature

```java
public class Session extends java.lang.Object
```

## Constructors

- `Session(java.lang.String usernameIn, java.lang.String playerIDIn, java.lang.String tokenIn, java.lang.String sessionTypeIn)`

## Methods

- `java.lang.String getPlayerID()`
- `GameProfile getProfile()`
- `java.lang.String getSessionID()`
- `Session.Type getSessionType()` — Returns either 'legacy' or 'mojang' whether the account is migrated or not
- `java.lang.String getToken()`
- `java.lang.String getUsername()`
- `boolean hasCachedProperties()`
- `void setProperties(com.mojang.authlib.properties.PropertyMap properties)`
