# ServerChatEvent

## Class signature

```java
public class ServerChatEvent extends Event
```

## Constructors

- `public ServerChatEvent( EntityPlayerMP player, java.lang.String message, ITextComponent component)`

## Methods

- `public void setComponent( ITextComponent e)`
- `public ITextComponent getComponent()`
- `public java.lang.String getMessage()`
- `public java.lang.String getUsername()`
- `public EntityPlayerMP getPlayer()`

## Description

ServerChatEvent is fired whenever a C01PacketChatMessage is processed. This event is fired via ForgeHooks#onServerChatEvent(net.minecraft.network.NetHandlerPlayServer, String, ChatComponentTranslation