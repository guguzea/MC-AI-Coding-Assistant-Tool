---
title: "Session"
description: "Returns either 'legacy' or 'mojang' whether the account is migrated or not"
package: "net/minecraft/util"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/Session.html"
sourceType: javadoc
---

# Session

## Class signature

```java
public class Session extends java.lang.Object
```

## Constructors

- `public Session(java.lang.String usernameIn, java.lang.String playerIDIn, java.lang.String tokenIn, java.lang.String sessionTypeIn)`

## Methods

- `public java.lang.String getSessionID()`
- `public java.lang.String getPlayerID()`
- `public java.lang.String getUsername()`
- `public java.lang.String getToken()`
- `public GameProfile getProfile()`
- `public Session.Type getSessionType()`
- `public void setProperties(com.mojang.authlib.properties.PropertyMap properties)`
- `public boolean hasCachedProperties()`

## Description

Returns either 'legacy' or 'mojang' whether the account is migrated or not
