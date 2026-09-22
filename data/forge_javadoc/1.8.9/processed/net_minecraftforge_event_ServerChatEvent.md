# ServerChatEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.ServerChatEvent

## Class signature

```java
public class ServerChatEvent extends Event
```

## Constructors

- `ServerChatEvent(EntityPlayerMP player, java.lang.String message, ChatComponentTranslation component)`

## Methods

- `IChatComponent getComponent()`
- `void setComponent(IChatComponent e)`

## Fields

- `ChatComponentTranslation component`
- `java.lang.String message`
- `EntityPlayerMP player`
- `java.lang.String username`