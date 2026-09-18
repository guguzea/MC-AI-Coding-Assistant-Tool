# UserListWhitelist

## Class signature

```java
public class UserListWhitelist extends UserList <GameProfile, UserListWhitelistEntry >
```

## Constructors

- `public UserListWhitelist(java.io.File p_i1132_1_)`

## Methods

- `protected UserListEntry <GameProfile> createEntry(JsonObject entryData)`
- `public java.lang.String[] getKeys()`
- `public boolean isWhitelisted(GameProfile profile)`
- `protected java.lang.String getObjectKey(GameProfile obj)`
- `public GameProfile getBannedProfile(java.lang.String p_152706_1_)`

## Description

Gets the GameProfile for the UserListBanEntry with the specified username, if present