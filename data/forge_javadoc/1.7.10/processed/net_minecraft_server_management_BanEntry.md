# BanEntry

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserListEntry → net.minecraft.server.management.BanEntry

## Class signature

```java
public abstract class BanEntry extends UserListEntry
```

## Constructors

- `BanEntry(java.lang.Object p_i1173_1_, java.util.Date p_i1173_2_, java.lang.String p_i1173_3_, java.util.Date p_i1173_4_, java.lang.String p_i1173_5_)`
- `BanEntry(java.lang.Object p_i1174_1_, JsonObject p_i1174_2_)`

## Methods

- `protected void func_152641_a(JsonObject p_152641_1_)`
- `java.util.Date getBanEndDate()`
- `java.lang.String getBanReason()`

## Fields

- `protected java.util.Date banEndDate`
- `protected java.lang.String bannedBy`
- `protected java.util.Date banStartDate`
- `static java.text.SimpleDateFormat dateFormat`
- `protected java.lang.String reason`