# networking

> 来源：https://docs.fabricmc.net/develop/networking
> 版本：1.16.5
> GitHub 路径：develop/networking.md
> 抓取源：vitepress

# Networking 26.1.2 ​
A general guide on networking using Fabric API.Networking in Minecraft is used so the client and server can communicate with each other. Networking is a broad topic, so this page is split up into a few categories.

## Why Is Networking Important? ​
Packets are the core concept of networking in Minecraft. Packets are made up of arbitrary data that can be sent either from server to client or from client to server. Check out the diagram below, which provides a visual representation of the networking architecture in Fabric:

Notice how packets are the bridge between the server and the client; that's because almost everything you do in the game involves networking in some way, whether you know it or not. For example, when you send a chat message, a packet is sent to the server with the content. The server then sends another packet to all the other clients with your message.

One important thing to keep in mind is there is always a server running, even in singleplayer and LAN. Packets are still used to communicate between the client and server even when no one else is playing with you. When talking about sides in networking, the terms "logical client" and "logical server" are used. The integrated singleplayer/LAN server and the dedicated server are both logical servers, but only the dedicated server can be considered a physical server.

When state is not synced between the client and server, you can run into issues where the server or other clients don't agree with what another client is doing. This is often known as a "desync". When writing your own mod you may need to send a packet of data to keep the state of the server and all clients in sync.

## An Introduction to Networking ​

### Defining a Payload ​
INFOA payload is the data that is sent within a packet.

This can be done by creating a Java Record with a BlockPos parameter that implements CustomPacketPayload.

javapublic record ClientboundSummonLightningPayload(BlockPos pos) implements CustomPacketPayload {
	public static final Identifier SUMMON_LIGHTNING_PAYLOAD_ID = Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "summon_lightning");
	public static final CustomPacketPayload.Type<ClientboundSummonLightningPayload> TYPE = new CustomPacketPayload.Type<>(SUMMON_LIGHTNING_PAYLOAD_ID);
	public static final StreamCodec<RegistryFriendlyByteBuf, ClientboundSummonLightningPayload> CODEC = StreamCodec.composite(BlockPos.STREAM_CODEC, ClientboundSummonLightningPayload::pos, ClientboundSummonLightningPayload::new);

	@Override
	public Type<? extends CustomPacketPayload> type() {
		return TYPE;
	}
}12345678910At the same time, we've defined:

- An Identifier used to identify our packet's payload. For this example our identifier will be example-mod:summon_lightning.
javapublic static final Identifier SUMMON_LIGHTNING_PAYLOAD_ID = Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "summon_lightning");1- A public static instance of CustomPayload.Type to uniquely identify this custom payload. We will be referencing this ID in both our common and client code.
javapublic static final CustomPacketPayload.Type<ClientboundSummonLightningPayload> TYPE = new CustomPacketPayload.Type<>(SUMMON_LIGHTNING_PAYLOAD_ID);1- A public static instance of a StreamCodec so that the game knows how to serialize/deserialize the contents of the packet.
javapublic static final StreamCodec<RegistryFriendlyByteBuf, ClientboundSummonLightningPayload> CODEC = StreamCodec.composite(BlockPos.STREAM_CODEC, ClientboundSummonLightningPayload::pos, ClientboundSummonLightningPayload::new);1We have also overridden type to return our payload ID.

java@Override
public Type<? extends CustomPacketPayload> type() {
	return TYPE;
}1234
### Registering a Payload ​
Before we send a packet with our custom payload, we need to register it on both physical sides.

This can be done in our common initializer by using PayloadTypeRegistry.clientboundPlay().register which takes in a CustomPayload.Type and a StreamCodec.

javaPayloadTypeRegistry.clientboundPlay().register(ClientboundSummonLightningPayload.TYPE, ClientboundSummonLightningPayload.CODEC);1A similar method exists to register client-to-server payloads: PayloadTypeRegistry.serverboundPlay().register.

### Sending a Packet to the Client ​
To send a packet with our custom payload, we can use ServerPlayNetworking.send which takes in a ServerPlayer and a CustomPayload.

Let's start by creating our Lightning Tater item. You can override use to trigger an action when the item is used. In this case, let's send packets to the players in the server level.

javapublic class LightningTaterItem extends Item {
	public LightningTaterItem(Properties properties) {
		super(properties);
	}

	@Override
	public InteractionResult use(Level level, Player user, InteractionHand hand) {
		if (level.isClientSide()) {
			return InteractionResult.PASS;
		}

		ClientboundSummonLightningPayload payload = new ClientboundSummonLightningPayload(user.blockPosition());

		for (ServerPlayer player : PlayerLookup.level((ServerLevel) level)) {
			ServerPlayNetworking.send(player, payload);
		}

		return InteractionResult.SUCCESS;
	}
}1234567891011121314151617181920Let's examine the code above.

We only send packets when the action is initiated on the server, by returning early with a isClientSide() check:

javaif (level.isClientSide()) {
	return InteractionResult.PASS;
}123We create an instance of the payload with the user's position:

javaClientboundSummonLightningPayload payload = new ClientboundSummonLightningPayload(user.blockPosition());1Finally, we get the players in the server level through PlayerLookup and send a packet to each player.

javafor (ServerPlayer player : PlayerLookup.level((ServerLevel) level)) {
	ServerPlayNetworking.send(player, payload);
}123INFOFabric API provides PlayerLookup, a collection of helper functions that will look up players in a server.

A term frequently used to describe the functionality of these methods is "tracking". It means that an entity or a chunk on the server is known to a player's client (within their view distance) and the entity or block entity should notify tracking clients of changes.

Tracking is an important concept for efficient networking, so that only the necessary players are notified of changes by sending packets.

### Receiving a Packet on the Client ​
To receive a packet sent from a server on the client, you need to specify how you will handle the incoming packet.

This can be done in the client initializer, by calling ClientPlayNetworking.registerGlobalReceiver and passing a CustomPayload.Type and a PlayPayloadHandler, which is a Functional Interface.

In this case, we'll define the action to trigger within the implementation of PlayPayloadHandler implementation (as a lambda expression).

javaClientPlayNetworking.registerGlobalReceiver(ClientboundSummonLightningPayload.TYPE, (payload, context) -> {
	ClientLevel level = context.client().level;

	if (level == null) {
		return;
	}

	BlockPos lightningPos = payload.pos();
	LightningBolt entity = EntityType.LIGHTNING_BOLT.create(level, EntitySpawnReason.TRIGGERED);

	if (entity != null) {
		entity.setPos(lightningPos.getX(), lightningPos.getY(), lightningPos.getZ());
		level.addEntity(entity);
	}
});123456789101112131415Let's examine the code above.

We can access the data from our payload by calling the Record's getter methods. In this case payload.pos(). Which then can be used to get the x, y and z positions.

javaBlockPos lightningPos = payload.pos();1Finally, we create a LightningBolt and add it to the level.

javaLightningBolt entity = EntityType.LIGHTNING_BOLT.create(level, EntitySpawnReason.TRIGGERED);

if (entity != null) {
	entity.setPos(lightningPos.getX(), lightningPos.getY(), lightningPos.getZ());
	level.addEntity(entity);
}123456Now, if you add this mod to a server and when a player uses our Lightning Tater item, every player will see lightning striking at the user's position.

### Sending a Packet to the Server ​
Just like sending a packet to the client, we start by creating a custom payload. This time, when a player uses a Poisonous Potato on a living entity, we request the server to apply the Glowing effect to it.

javapublic record GiveGlowingEffectServerboundPayload(int entityId) implements CustomPacketPayload {
	public static final Identifier GIVE_GLOWING_EFFECT_PAYLOAD_ID = Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "give_glowing_effect");
	public static final CustomPacketPayload.Type<GiveGlowingEffectServerboundPayload> TYPE = new CustomPacketPayload.Type<>(GIVE_GLOWING_EFFECT_PAYLOAD_ID);
	public static final StreamCodec<RegistryFriendlyByteBuf, GiveGlowingEffectServerboundPayload> CODEC = StreamCodec.composite(ByteBufCodecs.INT, GiveGlowingEffectServerboundPayload::entityId, GiveGlowingEffectServerboundPayload::new);

	@Override
	public Type<? extends CustomPacketPayload> type() {
		return TYPE;
	}
}12345678910We pass in the appropriate codec along with a method reference to get the value from the Record to build this codec.

Then we register our payload in our common initializer. However, this time as Client-to-Server payload by using PayloadTypeRegistry.serverboundPlay().register.

javaPayloadTypeRegistry.serverboundPlay().register(GiveGlowingEffectServerboundPayload.TYPE, GiveGlowingEffectServerboundPayload.CODEC);1To send a packet, let's add an action when the player uses a Poisonous Potato. We'll be using the UseEntityCallback event to keep things concise.

We register the event in our client initializer, and we use isClientSide() to ensure that the action is only triggered on the logical client.

javaUseEntityCallback.EVENT.register((player, level, hand, entity, hitResult) -> {
	if (!level.isClientSide()) {
		return InteractionResult.PASS;
	}

	ItemStack usedItemStack = player.getItemInHand(hand);

	if (entity instanceof LivingEntity && usedItemStack.is(Items.POISONOUS_POTATO) && hand == InteractionHand.MAIN_HAND) {
		GiveGlowingEffectServerboundPayload payload = new GiveGlowingEffectServerboundPayload(hitResult.getEntity().getId());
		ClientPlayNetworking.send(payload);

		return InteractionResult.SUCCESS;
	}

	return InteractionResult.PASS;
});12345678910111213141516We create an instance of our GiveGlowingEffectServerboundPayload with the necessary arguments. In this case, the network ID of the targeted entity.

javaGiveGlowingEffectServerboundPayload payload = new GiveGlowingEffectServerboundPayload(hitResult.getEntity().getId());1Finally, we send a packet to the server by calling ClientPlayNetworking.send with the instance of our GiveGlowingEffectServerboundPayload.

javaClientPlayNetworking.send(payload);1
### Receiving a Packet on the Server ​
This can be done in the common initializer, by calling ServerPlayNetworking.registerGlobalReceiver and passing a CustomPayload.Type and a PlayPayloadHandler.

javaServerPlayNetworking.registerGlobalReceiver(GiveGlowingEffectServerboundPayload.TYPE, (payload, context) -> {
	Entity entity = context.player().level().getEntity(payload.entityId());

	if (entity instanceof LivingEntity livingEntity && livingEntity.closerThan(context.player(), 5)) {
		livingEntity.addEffect(new MobEffectInstance(MobEffects.GLOWING, 100));
	}
});1234567INFOIt is important that you validate the content of the packet on the server side.

In this case, we validate if the entity exists based on its network ID.

javaEntity entity = context.player().level().getEntity(payload.entityId());1Additionally, the targeted entity has to be a living entity, and we restrict the range of the target entity from the player to 5.

javalivingEntity.addEffect(new MobEffectInstance(MobEffects.GLOWING, 100));1Now when any player tries to use a Poisonous Potato on a living entity, the glowing effect will be applied to it.