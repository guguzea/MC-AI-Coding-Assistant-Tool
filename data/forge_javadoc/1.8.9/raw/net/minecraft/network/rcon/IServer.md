---
title: "IServer"
description: "Returns an array of the usernames of all the connected players."
package: "net/minecraft/network/rcon"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/rcon/IServer.html"
sourceType: javadoc
---

# IServer

## Class signature

```java
public interface IServer
```

## Methods

- `int getIntProperty(java.lang.String key, int defaultValue)`
- `java.lang.String getStringProperty(java.lang.String key, java.lang.String defaultValue)`
- `void setProperty(java.lang.String key, java.lang.Object value)`
- `void saveProperties()`
- `java.lang.String getSettingsFilename()`
- `java.lang.String getHostname()`
- `int getPort()`
- `java.lang.String getMotd()`
- `java.lang.String getMinecraftVersion()`
- `int getCurrentPlayerCount()`
- `int getMaxPlayers()`
- `java.lang.String[] getAllUsernames()`
- `java.lang.String getFolderName()`
- `java.lang.String getPlugins()`
- `java.lang.String handleRConCommand(java.lang.String command)`
- `boolean isDebuggingEnabled()`
- `void logInfo(java.lang.String msg)`
- `void logWarning(java.lang.String msg)`
- `void logSevere(java.lang.String msg)`
- `void logDebug(java.lang.String msg)`

## Description

Returns an array of the usernames of all the connected players.
