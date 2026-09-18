# FMLEmbeddedChannel

## Class signature

```java
public class FMLEmbeddedChannel extends EmbeddedChannel
```

## Constructors

- `public FMLEmbeddedChannel(java.lang.String channelName, Side source, ChannelHandler... handlers)`
- `public FMLEmbeddedChannel( ModContainer container, java.lang.String channelName, Side source, ChannelHandler... handlers)`

## Methods

- `public Packet generatePacketFrom(java.lang.Object object)`
- `public java.lang.String findChannelHandlerNameForType(java.lang.Class<? extends ChannelHandler> type)`

## Description

Utility wrapper around EmbeddedChannel . Provides some convenience methods associated with the specific needs of FML network handling.