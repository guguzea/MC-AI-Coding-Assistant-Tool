# UserListBans

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<GameProfile, UserListBansEntry> → net.minecraft.server.management.UserListBans

## Class signature

```java
public class UserListBans extends UserList<GameProfile, UserListBansEntry>
```

## Methods

- `protected UserListEntry<GameProfile> createEntry(JsonObject entryData)`
- `GameProfile getBannedProfile(java.lang.String username)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(GameProfile obj)`
- `boolean isBanned(GameProfile profile)`

## Fields

- `UserListBans`