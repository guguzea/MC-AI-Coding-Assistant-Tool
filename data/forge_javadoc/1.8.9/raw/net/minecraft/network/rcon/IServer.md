---
title: "IServer"
description: "public interface IServer"
package: "net/minecraft/network/rcon"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/rcon/IServer.html"
sourceType: javadoc
---

# IServer

## Class signature

```java
public interface IServer
```

## Methods

- `java.lang.String[] getAllUsernames()` — Returns an array of the usernames of all the connected players.
- `int getCurrentPlayerCount()` — Returns the number of players currently on the server.
- `java.lang.String getFolderName()`
- `java.lang.String getHostname()` — Returns the server's hostname.
- `int getIntProperty(java.lang.String key, int defaultValue)` — Gets an integer property.
- `int getMaxPlayers()` — Returns the maximum number of players allowed on the server.
- `java.lang.String getMinecraftVersion()` — Returns the server's Minecraft version as string.
- `java.lang.String getMotd()` — Returns the server message of the day
- `java.lang.String getPlugins()` — Used by RCon's Query in the form of "MajorServerMod 1.2.3: MyPlugin 1.3; AnotherPlugin 2.1; AndSoForth 1.0".
- `int getPort()` — Never used, but "getServerPort" is already taken.
- `java.lang.String getSettingsFilename()` — Returns the filename where server properties are stored
- `java.lang.String getStringProperty(java.lang.String key, java.lang.String defaultValue)` — Gets a string property.
- `java.lang.String handleRConCommand(java.lang.String command)` — Handle a command received by an RCon instance
- `boolean isDebuggingEnabled()` — Returns true if debugging is enabled, false otherwise.
- `void logDebug(java.lang.String msg)` — If isDebuggingEnabled(), logs the message with a level of INFO.
- `void logInfo(java.lang.String msg)` — Logs the message with a level of INFO.
- `void logSevere(java.lang.String msg)` — Logs the error message with a level of SEVERE.
- `void logWarning(java.lang.String msg)` — Logs the message with a level of WARN.
- `void saveProperties()` — Saves all of the server properties to the properties file.
- `void setProperty(java.lang.String key, java.lang.Object value)` — Saves an Object with the given property name.
