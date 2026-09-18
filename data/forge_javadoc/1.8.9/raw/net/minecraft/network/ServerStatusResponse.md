---
title: "ServerStatusResponse"
description: "Returns this object as a Json string."
package: "net/minecraft/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/ServerStatusResponse.html"
sourceType: javadoc
---

# ServerStatusResponse

## Class signature

```java
public class ServerStatusResponse extends java.lang.Object
```

## Constructors

- `public ServerStatusResponse()`

## Methods

- `public IChatComponent getServerDescription()`
- `public void setServerDescription( IChatComponent motd)`
- `public ServerStatusResponse.PlayerCountData getPlayerCountData()`
- `public void setPlayerCountData( ServerStatusResponse.PlayerCountData countData)`
- `public ServerStatusResponse.MinecraftProtocolVersionIdentifier getProtocolVersionInfo()`
- `public void setProtocolVersionInfo( ServerStatusResponse.MinecraftProtocolVersionIdentifier protocolVersionData)`
- `public void setFavicon(java.lang.String faviconBlob)`
- `public java.lang.String getFavicon()`
- `public java.lang.String getJson()`
- `public void invalidateJson()`

## Description

Returns this object as a Json string.
