# FMLNetworkEvent.CustomPacketRegistrationEvent

## Constructors

- `public CustomPacketRegistrationEvent( NetworkManager manager, java.util.Set<java.lang.String> registrations, java.lang.String operation, Side side, java.lang.Class< S > type)`

## Methods

- `public com.google.common.collect.ImmutableSet<java.lang.String> getRegistrations()`
- `public java.lang.String getOperation()`
- `public Side getSide()`

## Description

Fired when the REGISTER/UNREGISTER for custom channels is received.