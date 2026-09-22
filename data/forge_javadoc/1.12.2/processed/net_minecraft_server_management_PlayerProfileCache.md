# PlayerProfileCache

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerProfileCache

## Class signature

```java
public class PlayerProfileCache extends java.lang.Object
```

## Constructors

- `PlayerProfileCache(GameProfileRepository profileRepoIn, java.io.File usercacheFileIn)`

## Methods

- `void addEntry(GameProfile gameProfile)`
- `GameProfile getGameProfileForUsername(java.lang.String username)`
- `GameProfile getProfileByUUID(java.util.UUID uuid)`
- `java.lang.String[] getUsernames()`
- `void load()`
- `void save()`
- `static void setOnlineMode(boolean onlineModeIn)`

## Fields

- `static java.text.SimpleDateFormat DATE_FORMAT`
- `protected Gson gson`