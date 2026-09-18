# UserListOps

## Class signature

```java
public class UserListOps extends UserList <GameProfile, UserListOpsEntry >
```

## Constructors

- `public UserListOps(java.io.File saveFile)`

## Methods

- `protected UserListEntry <GameProfile> createEntry(JsonObject entryData)`
- `public java.lang.String[] getKeys()`
- `public int getPermissionLevel(GameProfile profile)`
- `public boolean bypassesPlayerLimit(GameProfile profile)`
- `protected java.lang.String getObjectKey(GameProfile obj)`
- `public GameProfile getGameProfileFromName(java.lang.String username)`