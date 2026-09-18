# UserListBans

## Class signature

```java
public class UserListBans extends UserList <GameProfile, UserListBansEntry >
```

## Constructors

- `public UserListBans(java.io.File bansFile)`

## Methods

- `protected UserListEntry <GameProfile> createEntry(JsonObject entryData)`
- `public boolean isBanned(GameProfile profile)`
- `public java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(GameProfile obj)`
- `public GameProfile isUsernameBanned(java.lang.String username)`

## Description

Gets the key value for the given object