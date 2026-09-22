# PlayerProfileCache

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerProfileCache

## Class signature

```java
public class PlayerProfileCache extends java.lang.Object
```

## Constructors

- `PlayerProfileCache(com.mojang.authlib.GameProfileRepository profileRepoIn, java.io.File usercacheFileIn)`

## Methods

- `void addEntry(com.mojang.authlib.GameProfile gameProfile)`
- `com.mojang.authlib.GameProfile getGameProfileForUsername(java.lang.String username)`
- `com.mojang.authlib.GameProfile getProfileByUUID(java.util.UUID uuid)`
- `java.lang.String[] getUsernames()`
- `void load()`
- `void save()`
- `static void setOnlineMode(boolean onlineModeIn)`

## Fields

- `static java.text.SimpleDateFormat DATE_FORMAT`
- `protected com.google.gson.Gson gson`