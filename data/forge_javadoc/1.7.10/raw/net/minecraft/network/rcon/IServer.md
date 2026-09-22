---
title: "IServer"
description: "public interface IServer"
package: "net/minecraft/network/rcon"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/network/rcon/IServer.html"
sourceType: javadoc
---

# IServer

## Class signature

```java
public interface IServer
```

## Methods

- `java.lang.String[] getAllUsernames()`
- `int getCurrentPlayerCount()`
- `java.lang.String getFolderName()`
- `java.lang.String getHostname()`
- `int getIntProperty(java.lang.String p_71327_1_, int p_71327_2_)`
- `int getMaxPlayers()`
- `java.lang.String getMinecraftVersion()`
- `java.lang.String getMotd()`
- `java.lang.String getPlugins()`
- `int getPort()`
- `java.lang.String getSettingsFilename()`
- `java.lang.String getStringProperty(java.lang.String p_71330_1_, java.lang.String p_71330_2_)`
- `java.lang.String handleRConCommand(java.lang.String p_71252_1_)`
- `boolean isDebuggingEnabled()`
- `void logDebug(java.lang.String p_71198_1_)`
- `void logInfo(java.lang.String p_71244_1_)`
- `void logSevere(java.lang.String p_71201_1_)`
- `void logWarning(java.lang.String p_71236_1_)`
- `void saveProperties()`
- `void setProperty(java.lang.String p_71328_1_, java.lang.Object p_71328_2_)`
