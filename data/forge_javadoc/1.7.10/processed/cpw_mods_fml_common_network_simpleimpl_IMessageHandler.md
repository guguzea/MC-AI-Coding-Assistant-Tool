# IMessageHandler

## Class signature

```java
public interface IMessageHandler<REQ extends IMessage ,REPLY extends IMessage >
```

## Methods

- `REPLY onMessage( REQ message, MessageContext ctx)`

## Description

A message handler based on IMessage . Implement and override #onMessage(IMessage) to process your packet. Supply the class to SimpleNetworkWrapper#registerMessage(Class, Class, byte, cpw.mods.fml.rela