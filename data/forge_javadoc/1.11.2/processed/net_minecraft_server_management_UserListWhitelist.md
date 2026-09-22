# UserListWhitelist

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<com.mojang.authlib.GameProfile, UserListWhitelistEntry> → net.minecraft.server.management.UserListWhitelist

## Class signature

```java
public class UserListWhitelist extends UserList<com.mojang.authlib.GameProfile, UserListWhitelistEntry>
```

## Methods

- `protected UserListEntry<com.mojang.authlib.GameProfile> createEntry(com.google.gson.JsonObject entryData)`
- `com.mojang.authlib.GameProfile getByName(java.lang.String profileName)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(com.mojang.authlib.GameProfile obj)`
- `boolean isWhitelisted(com.mojang.authlib.GameProfile profile)`

## Fields

- `UserListWhitelist`