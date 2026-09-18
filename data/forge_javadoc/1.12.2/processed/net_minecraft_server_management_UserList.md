# UserList

## Class signature

```java
public class UserList<K,V extends UserListEntry <K>> extends java.lang.Object
```

## Constructors

- `public UserList(java.io.File saveFile)`

## Methods

- `public boolean isLanServer()`
- `public void setLanServer(boolean state)`
- `public void addEntry( V entry)`
- `public V getEntry( K obj)`
- `public void removeEntry( K entry)`
- `public java.io.File getSaveFile()`
- `public java.lang.String[] getKeys()`
- `protected java.lang.String getObjectKey( K obj)`
- `protected boolean hasEntry( K entry)`
- `protected UserListEntry < K > createEntry(JsonObject entryData)`
- `protected java.util.Map<java.lang.String, V > getValues()`
- `public void writeChanges() throws java.io.IOException`
- `public boolean isEmpty()`
- `public void readSavedFile() throws java.io.IOException, java.io.FileNotFoundException`