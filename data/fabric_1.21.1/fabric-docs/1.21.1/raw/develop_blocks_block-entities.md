# blocks block entities

> 来源：https://docs.fabricmc.net/develop/blocks/block-entities
> 版本：1.21.1
> GitHub 路径：develop/blocks/block-entities.md
> 抓取源：vitepress
> 抓取时间：2026-07-11T14:04:47.066Z
> SHA256：f0d17654186e99bf0235aae348de62611a3e73b88c252474b9a2974d78bf5ec4
> 分支：main

# Block Entities 26.1.2 ​
Learn how to create block entities for your custom blocks.Block entities are a way to store additional data for a block, that is not part of the block state: inventory contents, custom name and so on. Minecraft uses block entities for blocks like chests, furnaces, and command blocks.

As an example, we will create a block that counts how many times it has been right-clicked.

## Creating the Block Entity ​
To make Minecraft recognize and load the new block entities, we need to create a block entity type. This is done by extending the BlockEntity class and registering it in a new ModBlockEntities class.

javapublic class CounterBlockEntity extends BlockEntity {
	public CounterBlockEntity(BlockPos pos, BlockState state) {
		super(ModBlockEntities.COUNTER_BLOCK_ENTITY, pos, state);
	}
}12345Registering a BlockEntity yields a BlockEntityType like the COUNTER_BLOCK_ENTITY we've used above:

javapublic static final BlockEntityType<CounterBlockEntity> COUNTER_BLOCK_ENTITY =
		register("counter", CounterBlockEntity::new, ModBlocks.COUNTER_BLOCK);

private static <T extends BlockEntity> BlockEntityType<T> register(
		String name,
		FabricBlockEntityTypeBuilder.Factory<? extends T> entityFactory,
		Block... blocks
) {
	Identifier id = Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, name);
	return Registry.register(BuiltInRegistries.BLOCK_ENTITY_TYPE, id, FabricBlockEntityTypeBuilder.<T>create(entityFactory, blocks).build());
}1234567891011TIPNote how the constructor of the CounterBlockEntity takes two parameters, but the BlockEntity constructor takes three: the BlockEntityType, the BlockPos, and the BlockState. If we didn't hard-code the BlockEntityType, the ModBlockEntities class wouldn't compile! This is because the BlockEntityFactory, which is a functional interface, describes a function that only takes two parameters, just like our constructor.

## Creating the Block ​
Next, to actually use the block entity, we need a block that implements EntityBlock. Let's create one and call it CounterBlock.

TIPThere's two ways to approach this:

- create a block that extends BaseEntityBlock and implement the createBlockEntity method
- create a block that implements EntityBlock by itself and override the createBlockEntity method
We'll use the first approach in this example, since BaseEntityBlock also provides some nice utilities.

javapublic class CounterBlock extends BaseEntityBlock {
	public CounterBlock(Properties settings) {
		super(settings);
	}

	@Override
	protected MapCodec<? extends BaseEntityBlock> codec() {
		return simpleCodec(CounterBlock::new);
	}

	@Nullable
	@Override
	public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
		return new CounterBlockEntity(pos, state);
	}
}12345678910111213141516Using BaseEntityBlock as the parent class means we also need to implement the createCodec method, which is rather easy.

Unlike blocks, which are singletons, a new block entity is created for every instance of the block. This is done with the createBlockEntity method, which takes the position and BlockState, and returns a BlockEntity, or null if there shouldn't be one.

Don't forget to register the block in the ModBlocks class, just like in the Creating Your First Block guide:

javapublic static final Block COUNTER_BLOCK = register(
		"counter_block",
		CounterBlock::new,
		BlockBehaviour.Properties.of(),
		true
);123456
## Using the Block Entity ​
Now that we have a block entity, we can use it to store the number of times the block has been right-clicked. We'll do this by adding a clicks field to the CounterBlockEntity class:

javaprivate int clicks = 0;
public int getClicks() {
	return this.clicks;
}

public void incrementClicks() {
	this.clicks++;
	this.setChanged();
}123456789The setChanged method, used in incrementClicks, tells the game that this entity's data has been updated; this will be useful when we add the methods to serialize the counter and load it back from the save file.

Next, we need to increment this field every time the block is right-clicked. This is done by overriding the useWithoutItem method in the CounterBlock class:

java@Override
protected InteractionResult useWithoutItem(BlockState state, Level level, BlockPos pos, Player player, BlockHitResult hit) {
	if (!(level.getBlockEntity(pos) instanceof CounterBlockEntity counterBlockEntity)) {
		return super.useWithoutItem(state, level, pos, player, hit);
	}

	counterBlockEntity.incrementClicks();

	if (level.isClientSide()) {
		player.sendOverlayMessage(Component.literal("You've clicked the block for the " + counterBlockEntity.getClicks() + "th time."));
	}

	return InteractionResult.SUCCESS;
}1234567891011121314Since the BlockEntity is not passed into the method, we use level.getBlockEntity(pos), and if the BlockEntity is not valid, return from the method.

## Saving and Loading Data ​
Now that we have a functional block, we should make it so that the counter doesn't reset between game restarts. This is done by serializing it into NBT when the game saves, and deserializing when it's loading.

Saving to NBT is done through ValueInputs and ValueOutputs. These views are responsible for storing errors from encoding/decoding, and keeping track of registries throughout the serialization process.

You can read from a ValueInput using the read method, passing in a Codec for the desired type. Likewise, you can write to a ValueOutput by using the store method, passing in a Codec for the type, and the value.

There are also methods for primitives, such as getInt, getShort, getBoolean etc. for reading and putInt, putShort, putBoolean etc. for writing. The View also provides methods for working with lists, nullable types, and nested objects.

Serialization is done with the saveAdditional method:

java@Override
protected void saveAdditional(ValueOutput output) {
	output.putInt("clicks", this.clicks);

	super.saveAdditional(output);
}123456Here, we add the fields that should be saved into the passed ValueOutput: in the case of the counter block, that's the clicks field.

Reading is similar, you get the values you saved previously from the ValueInput, and save them in the BlockEntity's fields:

java@Override
protected void loadAdditional(ValueInput input) {
	super.loadAdditional(input);

	this.clicks = input.getIntOr("clicks", 0);
}123456Now, if we save and reload the game, the counter block should continue from where it left off when saved.

While saveAdditional and loadAdditional handle saving and loading to and from disk, there is still an issue:

- The server knows the correct clicks value.
- The client does not receive the correct value when loading a chunk.
To fix this, we override getUpdateTag:

java@Override
public CompoundTag getUpdateTag(HolderLookup.Provider registryLookup) {
	return saveWithoutMetadata(registryLookup);
}1234Now, when a player logs in or moves into a chunk where the block exists, they will see the correct counter value right away.

## Syncing Data ​
While new players loading in the block will see the correct count, the count will not update for other players watching the interaction. This phenomenon is called a desync, and it occurs when the server has updated its state, but the clients haven't.

To solve this, we can use block entity update packets. Override the getUpdatePacket method, and return a packet containing the block's data from our getUpdateTag.

java@Override
public Packet<ClientGamePacketListener> getUpdatePacket() {
	return ClientboundBlockEntityDataPacket.create(this);
}1234Then, override setChanged to broadcast the data whenever the block entity changes.

java@Override
public void setChanged() {
	super.setChanged();

	if (level == null) return;

	BlockState state = getBlockState();
	level.sendBlockUpdated(worldPosition, state, state, Block.UPDATE_ALL);
}123456789Other players should now be able to see the count changing.

## Tickers ​
The EntityBlock interface also defines a method called getTicker, which can be used to run code every tick for each instance of the block. We can implement that by creating a static method that will be used as the BlockEntityTicker:

The getTicker method should also check if the passed BlockEntityType is the same as the one we're using, and if it is, return the function that will be called every tick. Thankfully, there is a utility function that does the check in BaseEntityBlock:

java@Nullable
@Override
public <T extends BlockEntity> BlockEntityTicker<T> getTicker(Level level, BlockState state, BlockEntityType<T> type) {
	return createTickerHelper(type, ModBlockEntities.COUNTER_BLOCK_ENTITY, CounterBlockEntity::tick);
}12345CounterBlockEntity::tick is a reference to the static method tick we should create in the CounterBlockEntity class. Structuring it like this is not required, but it's a good practice to keep the code clean and organized.

Let's say we want to make it so that the counter can only be incremented once every 10 ticks (2 times a second). We can do this by adding a ticksSinceLast field to the CounterBlockEntity class, and increasing it every tick:

javapublic static void tick(Level level, BlockPos blockPos, BlockState blockState, CounterBlockEntity entity) {
	entity.ticksSinceLast++;
}123Don't forget to serialize and deserialize this field!

Now we can use ticksSinceLast to check if the counter can be increased in incrementClicks:

javaif (this.ticksSinceLast < 10) return;
this.ticksSinceLast = 0;12TIPIf the block entity does not seem to tick, try checking the registration code! It should pass the blocks that are valid for this entity into the BlockEntityType.Builder, or else it will give a warning in the console:

log[13:27:55] [Server thread/WARN] (Minecraft) Block entity example-mod:counter @ BlockPos{x=-29, y=125, z=18} state Block{example-mod:counter_block} invalid for ticking:1Copied