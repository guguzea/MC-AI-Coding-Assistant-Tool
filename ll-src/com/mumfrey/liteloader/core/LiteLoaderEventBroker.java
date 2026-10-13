/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.mojang.authlib.GameProfile;
import com.mumfrey.liteloader.LiteMod;
import com.mumfrey.liteloader.PlayerInteractionListener;
import com.mumfrey.liteloader.PlayerInteractionListener.MouseButton;
import com.mumfrey.liteloader.PlayerMoveListener;
import com.mumfrey.liteloader.PluginChannelListener;
import com.mumfrey.liteloader.ServerCommandProvider;
import com.mumfrey.liteloader.ServerPlayerListener;
import com.mumfrey.liteloader.ServerPluginChannelListener;
import com.mumfrey.liteloader.ServerTickable;
import com.mumfrey.liteloader.ShutdownListener;
import com.mumfrey.liteloader.api.InterfaceProvider;
import com.mumfrey.liteloader.api.Listener;
import com.mumfrey.liteloader.api.ShutdownObserver;
import com.mumfrey.liteloader.common.GameEngine;
import com.mumfrey.liteloader.common.LoadingProgress;
import com.mumfrey.liteloader.common.ducks.IPacketClientSettings;
import com.mumfrey.liteloader.common.ducks.ITeleportHandler;
import com.mumfrey.liteloader.core.event.HandlerList;
import com.mumfrey.liteloader.core.event.HandlerList.ReturnLogicOp;
import com.mumfrey.liteloader.interfaces.FastIterable;
import com.mumfrey.liteloader.interfaces.FastIterableDeque;
import com.mumfrey.liteloader.launch.LoaderProperties;
import com.mumfrey.liteloader.util.Position;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;

import net.minecraft.command.ICommandManager;
import net.minecraft.command.ServerCommandManager;
import net.minecraft.entity.player.EntityPlayerMP;
import net.minecraft.item.ItemStack;
import net.minecraft.network.NetHandlerPlayServer;
import net.minecraft.network.NetworkManager;
import net.minecraft.network.play.client.CPacketClientSettings;
import net.minecraft.network.play.client.CPacketPlayer;
import net.minecraft.network.play.server.SPacketBlockChange;
import net.minecraft.network.play.server.SPacketPlayerPosLook;
import net.minecraft.network.play.server.SPacketPlayerPosLook.EnumFlags;
import net.minecraft.profiler.Profiler;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.management.PlayerInteractionManager;
import net.minecraft.server.management.PlayerList;
import net.minecraft.util.EnumFacing;
import net.minecraft.util.EnumHand;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.math.RayTraceResult.Type;
import net.minecraft.world.World;
import net.minecraft.world.WorldServer;
import net.minecraft.world.WorldSettings;

/**
 * @author Adam Mummery-Smith
 *
 * @param <TClient> Type of the client runtime, "Minecraft" on client and null
 *      on the server
 * @param <TServer> Type of the server runtime, "IntegratedServer" on the client
 *      "MinecraftServer" on the server 
 */
public abstract class LiteLoaderEventBroker<TClient, TServer extends MinecraftServer> implements InterfaceProvider, ShutdownObserver
{
    /**
     * @author Adam Mummery-Smith
     *
     * @param <T>
     */
    public static class ReturnValue<T>
    {
        private T value;
        private boolean isSet;

        public ReturnValue(T value)
        {
            this.value = value;
        }

        public ReturnValue()
        {
        }

        public boolean isSet()
        {
            return this.isSet;
        }

        public T get()
        {
            return this.value;
        }

        public void set(T value)
        {
            this.isSet = true;
            this.value = value;
        }
    }

    public static enum InteractType
    {
        RIGHT_CLICK,
        LEFT_CLICK,
        LEFT_CLICK_BLOCK,
        PLACE_BLOCK_MAYBE,
        DIG_BLOCK_MAYBE,
        DIG_BLOCK_END
    }

    /**
     * Singleton
     */
    protected static LiteLoaderEventBroker<?, ?> broker; 

    /**
     * Reference to the loader instance
     */
    protected final LiteLoader loader;

    /**
     * Reference to the game
     */
    protected final GameEngine<TClient, TServer> engine;

    /**
     * Profiler 
     */
    protected final Profiler profiler;

    protected LiteLoaderMods mods;

    private Map<UUID, PlayerEventState> playerStates = new HashMap<UUID, PlayerEventState>();
    private FastIterableDeque<IEventState> playerStateList = new HandlerList<IEventState>(IEventState.class);

    /**
     * List of mods which provide server commands
     */
    private FastIterable<ServerCommandProvider> serverCommandProviders
            = new HandlerList<ServerCommandProvider>(ServerCommandProvider.class);

    /**
     * List of mods which monitor server player events
     */
    private FastIterable<ServerPlayerListener> serverPlayerListeners
            = new HandlerList<ServerPlayerListener>(ServerPlayerListener.class);

    /**
     * List of mods which handle player interaction events 
     */
    private FastIterable<PlayerInteractionListener> playerInteractionListeners
            = new HandlerList<PlayerInteractionListener>(PlayerInteractionListener.class, ReturnLogicOp.AND);

    /**
     * List of mods which handle player movement events
     */
    private FastIterable<PlayerMoveListener> playerMoveListeners
            = new HandlerList<PlayerMoveListener>(PlayerMoveListener.class, ReturnLogicOp.AND_BREAK_ON_FALSE);

    /**
     * List of mods which monitor server ticks
     */
    private FastIterable<ServerTickable> serverTickListeners
            = new HandlerList<ServerTickable>(ServerTickable.class);

    /**
     * List of mods which want to be notified when the game is shutting down
     */
    private FastIterable<ShutdownListener> shutdownListeners
            = new HandlerList<ShutdownListener>(ShutdownListener.class);

    /**
     * ctor
     * 
     * @param loader
     * @param engine
     * @param properties
     */
    public LiteLoaderEventBroker(LiteLoader loader, GameEngine<TClient, TServer> engine, LoaderProperties properties)
    {
        this.loader   = loader;
        this.engine   = engine;
        this.profiler = engine.getProfiler();

        LiteLoaderEventBroker.broker = this;
    }
    
    @SuppressWarnings("unchecked")
    public static <TClient, TServer extends MinecraftServer> LiteLoaderEventBroker<TClient, TServer> getCommonBroker()
    {
        return (LiteLoaderEventBroker<TClient, TServer>)LiteLoaderEventBroker.broker;
    }

    /**
     * @param mods
     */
    void setMods(LiteLoaderMods mods)
    {
        this.mods = mods;
    }

    /**
     * 
     */
    protected void onStartupComplete()
    {
        LoadingProgress.setMessage("Checking mods...");
        this.mods.onStartupComplete();

        LoadingProgress.setMessage("Initialising CoreProviders...");
        this.loader.onStartupComplete();

        LoadingProgress.setMessage("Starting Game...");
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.api.InterfaceProvider#getListenerBaseType()
     */
    @Override
    public Class<? extends Listener> getListenerBaseType()
    {
        return LiteMod.class;
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.api.InterfaceProvider#registerInterfaces(
     *      com.mumfrey.liteloader.core.InterfaceRegistrationDelegate)
     */
    @Override
    public void registerInterfaces(InterfaceRegistrationDelegate delegate)
    {
        delegate.registerInterface(ServerCommandProvider.class);
        delegate.registerInterface(ServerPlayerListener.class);
        delegate.registerInterface(PlayerInteractionListener.class);
        delegate.registerInterface(PlayerMoveListener.class);
        delegate.registerInterface(CommonPluginChannelListener.class);
        delegate.registerInterface(ServerTickable.class);
        delegate.registerInterface(ShutdownListener.class);
    }

    /**
     * Add a listener to the relevant listener lists
     * 
     * @param listener
     */
    public void addCommonPluginChannelListener(CommonPluginChannelListener listener)
    {
        if (!(listener instanceof PluginChannelListener) && !(listener instanceof ServerPluginChannelListener))
        {
            LiteLoaderLogger.warning("Interface error for mod '%1s'. Implementing CommonPluginChannelListener has no effect! "
                    + "Use PluginChannelListener or ServerPluginChannelListener instead", listener.getName());
        }
    }

    /**
     * @param serverCommandProvider
     */
    public void addServerCommandProvider(ServerCommandProvider serverCommandProvider)
    {
        this.serverCommandProviders.add(serverCommandProvider);
    }

    /**
     * @param serverPlayerListener
     */
    public void addServerPlayerListener(ServerPlayerListener serverPlayerListener)
    {
        this.serverPlayerListeners.add(serverPlayerListener);
    }

    /**
     * @param playerInteractionListener
     */
    public void addPlayerInteractionListener(PlayerInteractionListener playerInteractionListener)
    {
        this.playerInteractionListeners.add(playerInteractionListener);
    }

    /**
     * @param playerMoveListener
     */
    public void addPlayerMoveListener(PlayerMoveListener playerMoveListener)
    {
        this.playerMoveListeners.add(playerMoveListener);
    }

    /**
     * @param serverTickable
     */
    public void addServerTickable(ServerTickable serverTickable)
    {
        this.serverTickListeners.add(serverTickable);
    }

    /**
     * @param shutdownListener
     */
    public void addShutdownListener(ShutdownListener shutdownListener)
    {
        this.shutdownListeners.add(shutdownListener);
    }

    /**
     * @param instance
     * @param folderName
     * @param worldName
     * @param worldSettings
     */
    public void onStartServer(MinecraftServer instance, String folderName, String worldName, WorldSettings worldSettings)
    {
        ICommandManager commandManager = instance.func_71187_D();

        if (commandManager instanceof ServerCommandManager)
        {
            ServerCommandManager serverCommandManager = (ServerCommandManager)commandManager;
            this.serverCommandProviders.all().provideCommands(serverCommandManager);
        }

        LiteLoader.getServerPluginChannels().onServerStartup();

        this.playerStates.clear();
    }

    /**
     * @param scm
     * @param player
     * @param profile
     */
    public void onSpawnPlayer(PlayerList scm, EntityPlayerMP player, GameProfile profile)
    {
        this.serverPlayerListeners.all().onPlayerConnect(player, profile);
        PlayerEventState playerState = this.getPlayerState(player);
        playerState.onSpawned();
    }

    /**
     * @param scm
     * @param player
     */
    public void onPlayerLogin(PlayerList scm, EntityPlayerMP player)
    {
        LiteLoader.getServerPluginChannels().onPlayerJoined(player);
    }

    /**
     * @param scm
     * @param netManager
     * @param player
     */
    public void onInitializePlayerConnection(PlayerList scm, NetworkManager netManager, EntityPlayerMP player)
    {
        this.serverPlayerListeners.all().onPlayerLoggedIn(player);
    }

    /**
     * @param scm
     * @param player
     * @param oldPlayer
     * @param dimension
     * @param won
     */
    public void onRespawnPlayer(PlayerList scm, EntityPlayerMP player, EntityPlayerMP oldPlayer, int dimension, boolean won)
    {
        this.serverPlayerListeners.all().onPlayerRespawn(player, oldPlayer, dimension, won);
    }

    /**
     * @param scm
     * @param player
     */
    public void onPlayerLogout(PlayerList scm, EntityPlayerMP player)
    {
        this.serverPlayerListeners.all().onPlayerLogout(player);
        this.removePlayer(player);
    }

    /**
     * @param clock
     * @param partialTicks
     * @param inGame
     */
    protected void onTick(boolean clock, float partialTicks, boolean inGame)
    {
        this.loader.onTick(clock, partialTicks, inGame);
    }

    /**
     * @param mouseX
     * @param mouseY
     * @param partialTicks
     */
    protected void onPostRender(int mouseX, int mouseY, float partialTicks)
    {
        this.loader.onPostRender(mouseX, mouseY, partialTicks);
    }

    protected void onWorldChanged(World world)
    {
        this.loader.onWorldChanged(world);
    }

    public void onServerTick(MinecraftServer server)
    {
        this.playerStateList.all().onTick(server);
        this.serverTickListeners.all().onTick(server);
    }

    public boolean onPlaceBlock(NetHandlerPlayServer netHandler, EntityPlayerMP player, EnumHand hand, BlockPos pos, EnumFacing facing)
    {
        if (!this.onPlayerInteract(InteractType.PLACE_BLOCK_MAYBE, player, hand, player.func_184586_b(hand), pos, facing))
        {
            SPacketBlockChange cancellation = new SPacketBlockChange(player.field_70170_p, pos.func_177972_a(facing));
            netHandler.field_147369_b.field_71135_a.func_147359_a(cancellation);
            player.func_71120_a(player.field_71069_bz);
            return false;
        }

        return true;
    }

    public boolean onClickedAir(InteractType action, EntityPlayerMP player, EnumHand hand)
    {
        return this.onPlayerInteract(action, player, hand, player.func_184586_b(hand), null, EnumFacing.SOUTH);
    }

    public boolean onPlayerDigging(InteractType action, EntityPlayerMP player, NetHandlerPlayServer netHandler, BlockPos pos)
    {
        if (!this.onPlayerInteract(action, player, EnumHand.MAIN_HAND, player.func_184614_ca(), pos, EnumFacing.SOUTH))
        {
            SPacketBlockChange cancellation = new SPacketBlockChange(player.field_70170_p, pos);
            netHandler.field_147369_b.field_71135_a.func_147359_a(cancellation);
            return false;
        }

        return true;
    }

    public boolean onUseItem(EntityPlayerMP player, EnumHand hand, ItemStack stack, BlockPos pos, EnumFacing side)
    {
        if (!this.onPlayerInteract(InteractType.PLACE_BLOCK_MAYBE, player, hand, stack, pos, side))
        {
            SPacketBlockChange cancellation = new SPacketBlockChange(player.field_70170_p, pos);
            player.field_71135_a.func_147359_a(cancellation);
            return false;
        }

        return true;
    }

    public boolean onBlockClicked(BlockPos pos, EnumFacing side, PlayerInteractionManager manager)
    {
        EntityPlayerMP player = manager.field_73090_b;
        if (!this.onPlayerInteract(InteractType.LEFT_CLICK_BLOCK, player, EnumHand.MAIN_HAND, player.func_184614_ca(), pos, side))
        {
            SPacketBlockChange cancellation = new SPacketBlockChange(manager.field_73092_a, pos);
            player.field_71135_a.func_147359_a(cancellation);
            return false;
        }

        return true;
    }
    
    public boolean onPlayerInteract(InteractType action, EntityPlayerMP player, EnumHand hand, ItemStack stack, BlockPos position, EnumFacing side)
    {
        return this.getPlayerState(player).onPlayerInteract(action, player, hand, stack, position, side);
    }

    public boolean onPlayerSwapItems(EntityPlayerMP player)
    {
        return this.playerInteractionListeners.all().onPlayerSwapItems(player);
    }

    void onPlayerClickedAir(EntityPlayerMP player, MouseButton button, EnumHand hand, BlockPos tracePos, EnumFacing traceSideHit, Type traceHitType)
    {
        this.playerInteractionListeners.all().onPlayerClickedAir(player, button, tracePos, traceSideHit, traceHitType);
    }

    boolean onPlayerClickedBlock(EntityPlayerMP player, MouseButton button, EnumHand hand, ItemStack stack, BlockPos hitPos, EnumFacing sideHit)
    {
        return this.playerInteractionListeners.all().onPlayerClickedBlock(player, button, hand, stack, hitPos, sideHit);
    }

    public boolean onPlayerMove(NetHandlerPlayServer netHandler, CPacketPlayer packet, EntityPlayerMP player, WorldServer world)
    {
        Position from = new Position(player, true);
        Position to = new Position(packet.func_186997_a(player.field_70165_t), packet.func_186996_b(player.field_70163_u), packet.func_187000_c(player.field_70161_v),
                packet.func_186999_a(player.field_70177_z), packet.func_186998_b(player.field_70125_A));
        
        ReturnValue<Position> pos = new ReturnValue<Position>(to);

        if (!this.playerMoveListeners.all().onPlayerMove(player, from, to, pos))
        {
            int teleportId = ((ITeleportHandler)player.field_71135_a).beginTeleport(from);
            player.func_70080_a(from.field_72450_a, from.field_72448_b, from.field_72449_c, player.field_70126_B, player.field_70127_C);
            player.field_71135_a.func_147359_a(new SPacketPlayerPosLook(from.field_72450_a, from.field_72448_b, from.field_72449_c,
                    player.field_70126_B, player.field_70127_C, Collections.<EnumFlags>emptySet(), teleportId));
            return false;
        }
        
        if (pos.isSet())
        {
            Position newPos = pos.get();
            netHandler.func_147364_a(newPos.field_72450_a, newPos.field_72448_b, newPos.field_72449_c, newPos.yaw, newPos.pitch);
            return false;
        }

        return true;
    }

    void onPlayerSettingsReceived(EntityPlayerMP player, CPacketClientSettings packet)
    {
        PlayerEventState playerState = this.getPlayerState(player);
        playerState.setTraceDistance(((IPacketClientSettings)packet).getViewDistance());
        playerState.setLocale(packet.func_149524_c());
    }

    public PlayerEventState getPlayerState(EntityPlayerMP player)
    {
        PlayerEventState playerState = this.playerStates.get(player.func_110124_au());
        if (playerState == null)
        {
            playerState = new PlayerEventState(player, this);
            this.playerStates.put(player.func_110124_au(), playerState);
            this.playerStateList.add(playerState);
        }
        return playerState;
    }

    protected void removePlayer(EntityPlayerMP player)
    {
        PlayerEventState playerState = this.playerStates.remove(player.func_110124_au());
        if (playerState != null)
        {
            this.playerStateList.remove(playerState);
        }
    }

    @Override
    public void onShutDown()
    {
        for (ShutdownListener listener : this.shutdownListeners)
        {
            try
            {
                listener.onShutDown();
            }
            catch (Throwable th)
            {
                th.printStackTrace();
            }
        }
    }
}
