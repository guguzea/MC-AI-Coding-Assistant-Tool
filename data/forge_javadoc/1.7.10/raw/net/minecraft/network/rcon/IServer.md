---
title: "IServer"
description: "public interface IServer"
package: "net/minecraft/network/rcon"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/network/rcon/IServer.html"
sourceType: javadoc
---

# IServer

## Class signature

```java
public interface IServer
```

## Methods

- `int getIntProperty(java.lang.String p_71327_1_, int p_71327_2_)`
- `java.lang.String getStringProperty(java.lang.String p_71330_1_, java.lang.String p_71330_2_)`
- `void setProperty(java.lang.String p_71328_1_, java.lang.Object p_71328_2_)`
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
- `java.lang.String handleRConCommand(java.lang.String p_71252_1_)`
- `boolean isDebuggingEnabled()`
- `void logInfo(java.lang.String p_71244_1_)`
- `void logWarning(java.lang.String p_71236_1_)`
- `void logSevere(java.lang.String p_71201_1_)`
- `void logDebug(java.lang.String p_71198_1_)`
