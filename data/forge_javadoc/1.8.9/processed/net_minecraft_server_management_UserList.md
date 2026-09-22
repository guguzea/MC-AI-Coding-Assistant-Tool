# UserList

**Inheritance:** java.lang.Object → net.minecraft.server.management.UserList<K, V>

## Class signature

```java
public class UserList<K, V extends UserListEntry<K>> extends java.lang.Object
```

## Constructors

- `UserList(java.io.File saveFile)`

## Methods

- `void addEntry(V entry)` — Adds an entry to the list
- `protected UserListEntry<K> createEntry(JsonObject entryData)`
- `V getEntry(K obj)`
- `java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey(K obj)` — Gets the key value for the given object
- `java.io.File getSaveFile()`
- `protected java.util.Map<java.lang.String, V> getValues()`
- `protected boolean hasEntry(K entry)`
- `boolean isEmpty()`
- `boolean isLanServer()`
- `void readSavedFile()`
- `void removeEntry(K entry)`
- `void setLanServer(boolean state)`
- `void writeChanges()`

## Fields

- `protected Gson gson`
- `protected static Logger logger`