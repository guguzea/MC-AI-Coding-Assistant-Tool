# PacketUtil

## Class signature

```java
public class PacketUtil extends java.lang.Object
```

## Methods

- `public static void writeItemStackFromClientToServer( PacketBuffer buffer, ItemStack stack)`

## Description

Most ItemStack serialization is Server to Client, and must go through PacketBuffer.writeItemStack which uses Item.getNBTShareTag.