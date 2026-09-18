# ServerData

## Class signature

```java
public class ServerData extends java.lang.Object
```

## Constructors

- `public ServerData(java.lang.String name, java.lang.String ip, boolean isLan)`

## Methods

- `public NBTTagCompound getNBTCompound()`
- `public ServerData.ServerResourceMode getResourceMode()`
- `public void setResourceMode( ServerData.ServerResourceMode mode)`
- `public static ServerData getServerDataFromNBTCompound( NBTTagCompound nbtCompound)`
- `public java.lang.String getBase64EncodedIconData()`
- `public void setBase64EncodedIconData(java.lang.String icon)`
- `public boolean isOnLAN()`
- `public void copyFrom( ServerData serverDataIn)`