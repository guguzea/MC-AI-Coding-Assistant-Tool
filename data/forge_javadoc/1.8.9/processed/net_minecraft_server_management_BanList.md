# BanList

## Class signature

```java
public class BanList extends UserList <java.lang.String, IPBanEntry >
```

## Constructors

- `public BanList(java.io.File bansFile)`

## Methods

- `protected UserListEntry <java.lang.String> createEntry(JsonObject entryData)`
- `public boolean isBanned(java.net.SocketAddress address)`
- `public IPBanEntry getBanEntry(java.net.SocketAddress address)`