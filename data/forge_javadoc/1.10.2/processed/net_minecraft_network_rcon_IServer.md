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
- `int getIntProperty(java.lang.String key, int defaultValue)`
- `int getMaxPlayers()`
- `java.lang.String getMinecraftVersion()`
- `java.lang.String getMotd()`
- `java.lang.String getPlugins()`
- `int getPort()`
- `java.lang.String getSettingsFilename()`
- `java.lang.String getStringProperty(java.lang.String key, java.lang.String defaultValue)`
- `java.lang.String handleRConCommand(java.lang.String command)`
- `boolean isDebuggingEnabled()`
- `void logDebug(java.lang.String msg)`
- `void logInfo(java.lang.String msg)`
- `void logSevere(java.lang.String msg)`
- `void logWarning(java.lang.String msg)`
- `void saveProperties()`
- `void setProperty(java.lang.String key, java.lang.Object value)`