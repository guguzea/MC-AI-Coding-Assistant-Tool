# UserListWhitelist

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<GameProfile, UserListWhitelistEntry> → net.minecraft.server.management.UserListWhitelist

## Class signature

```java
public class UserListWhitelist extends UserList<GameProfile, UserListWhitelistEntry>
```

## Methods

- `protected UserListEntry<GameProfile> createEntry(JsonObject entryData)`
- `GameProfile getByName(java.lang.String profileName)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(GameProfile obj)`
- `boolean isWhitelisted(GameProfile profile)`

## Fields

- `UserListWhitelist`