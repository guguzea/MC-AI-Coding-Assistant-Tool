# UserListBans

## Class signature

```java
public class UserListBans extends UserList <com.mojang.authlib.GameProfile, UserListBansEntry >
```

## Constructors

- `public UserListBans(java.io.File bansFile)`

## Methods

- `protected UserListEntry <com.mojang.authlib.GameProfile> createEntry(com.google.gson.JsonObject entryData)`
- `public boolean isBanned(com.mojang.authlib.GameProfile profile)`
- `public java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(com.mojang.authlib.GameProfile obj)`
- `public com.mojang.authlib.GameProfile getBannedProfile(java.lang.String username)`