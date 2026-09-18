# BanEntry

## Class signature

```java
public abstract class BanEntry<T> extends UserListEntry <T>
```

## Constructors

- `public BanEntry( T valueIn, java.util.Date startDate, java.lang.String banner, java.util.Date endDate, java.lang.String banReason)`
- `protected BanEntry( T valueIn, JsonObject json)`

## Methods

- `public java.util.Date getBanEndDate()`
- `public java.lang.String getBanReason()`
- `protected void onSerialization(JsonObject data)`