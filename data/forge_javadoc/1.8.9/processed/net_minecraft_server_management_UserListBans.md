# UserListBans

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<GameProfile, UserListBansEntry> → net.minecraft.server.management.UserListBans

## Class signature

```java
public class UserListBans extends UserList<GameProfile, UserListBansEntry>
```

## Methods

- `protected UserListEntry<GameProfile> createEntry(JsonObject entryData)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(GameProfile obj)` — Gets the key value for the given object
- `boolean isBanned(GameProfile profile)`
- `GameProfile isUsernameBanned(java.lang.String username)`

## Fields

- `UserListBans`