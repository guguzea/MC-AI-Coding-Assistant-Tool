# BanList

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<java.lang.String, IPBanEntry> → net.minecraft.server.management.BanList

## Class signature

```java
public class BanList extends UserList<java.lang.String, IPBanEntry>
```

## Methods

- `protected UserListEntry<java.lang.String> createEntry(JsonObject entryData)`
- `IPBanEntry getBanEntry(java.net.SocketAddress address)`
- `boolean isBanned(java.net.SocketAddress address)`

## Fields

- `BanList`