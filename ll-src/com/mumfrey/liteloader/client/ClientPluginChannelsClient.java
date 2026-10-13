/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client;

import com.mumfrey.liteloader.client.ducks.IClientNetLoginHandler;
import com.mumfrey.liteloader.core.ClientPluginChannels;
import com.mumfrey.liteloader.core.PluginChannels;
import com.mumfrey.liteloader.core.exceptions.UnregisteredChannelException;

import net.minecraft.client.Minecraft;
import net.minecraft.network.INetHandler;
import net.minecraft.network.NetworkManager;
import net.minecraft.network.PacketBuffer;
import net.minecraft.network.login.INetHandlerLoginClient;
import net.minecraft.network.login.server.SPacketLoginSuccess;
import net.minecraft.network.play.INetHandlerPlayClient;
import net.minecraft.network.play.client.CPacketCustomPayload;
import net.minecraft.network.play.server.SPacketCustomPayload;
import net.minecraft.network.play.server.SPacketJoinGame;

/**
 * Handler for client plugin channels
 * 
 * @author Adam Mummery-Smith
 */
public class ClientPluginChannelsClient extends ClientPluginChannels
{
    /**
     * @param netHandler
     * @param loginPacket
     */
    void onPostLogin(INetHandlerLoginClient netHandler, SPacketLoginSuccess loginPacket)
    {
        this.clearPluginChannels(netHandler);
    }

    /**
     * @param netHandler
     * @param loginPacket
     */
    void onJoinGame(INetHandler netHandler, SPacketJoinGame loginPacket)
    {
        this.sendRegisteredPluginChannels(netHandler);
    }

    /**
     * Callback for the plugin channel hook
     * 
     * @param customPayload
     */
    @Override
    public void onPluginChannelMessage(SPacketCustomPayload customPayload)
    {
        if (customPayload != null && customPayload.func_149169_c() != null)
        {
            String channel = customPayload.func_149169_c();
            PacketBuffer data = customPayload.func_180735_b();

            this.onPluginChannelMessage(channel, data);
        }
    }

    /**
     * @param netHandler
     * @param registrationData
     */
    @Override
    protected void sendRegistrationData(INetHandler netHandler, PacketBuffer registrationData)
    {
        if (netHandler instanceof INetHandlerLoginClient)
        {
            NetworkManager networkManager = ((IClientNetLoginHandler)netHandler).getNetMgr();
            networkManager.func_179290_a(new CPacketCustomPayload(CHANNEL_REGISTER, registrationData));
        }
        else if (netHandler instanceof INetHandlerPlayClient)
        {
            ClientPluginChannelsClient.dispatch(new CPacketCustomPayload(CHANNEL_REGISTER, registrationData));
        }
    }

    /**
     * Send a message to the server on a plugin channel
     * 
     * @param channel Channel to send, must not be a reserved channel name
     * @param data
     */
    @Override
    protected boolean send(String channel, PacketBuffer data, ChannelPolicy policy)
    {
        if (!PluginChannels.isValidChannelName(channel))
        {
            throw new RuntimeException("Invalid channel name specified"); 
        }

        if (!policy.allows(this, channel))
        {
            if (policy.isSilent()) return false;
            throw new UnregisteredChannelException(channel);
        }

        CPacketCustomPayload payload = new CPacketCustomPayload(channel, data);
        return ClientPluginChannelsClient.dispatch(payload);
    }

    /**
     * @param payload
     */
    static boolean dispatch(CPacketCustomPayload payload)
    {
        try
        {
            Minecraft minecraft = Minecraft.func_71410_x();

            if (minecraft.field_71439_g != null && minecraft.field_71439_g.field_71174_a != null)
            {
                minecraft.field_71439_g.field_71174_a.func_147297_a(payload);
                return true;
            }
        }
        catch (Exception ex) {}

        return false;
    }
}
