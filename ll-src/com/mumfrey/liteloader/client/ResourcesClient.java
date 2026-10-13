/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mumfrey.liteloader.client.overlays.IMinecraft;
import com.mumfrey.liteloader.common.LoadingProgress;
import com.mumfrey.liteloader.common.Resources;

import net.minecraft.client.Minecraft;
import net.minecraft.client.resources.IResourceManager;
import net.minecraft.client.resources.IResourcePack;

public class ResourcesClient implements Resources<IResourceManager, IResourcePack>
{
    private final Minecraft engine = Minecraft.func_71410_x();

    /**
     * Registered resource packs 
     */
    private final Map<String, IResourcePack> registeredResourcePacks = new HashMap<String, IResourcePack>();

    /**
     * True while initialising mods if we need to do a resource manager reload
     * once the process is completed.
     */
    private boolean pendingResourceReload;

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.common.GameEngine#refreshResources(boolean)
     */
    @Override
    public void refreshResources(boolean force)
    {
        if (this.pendingResourceReload || force)
        {
            LoadingProgress.setMessage("Reloading Resources...");
            this.pendingResourceReload = false;
            this.engine.func_110436_a();
        }
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.common.GameEngine#getResourceManager()
     */
    @Override
    public IResourceManager getResourceManager()
    {
        return this.engine.func_110442_L();
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.common.GameEngine#registerResourcePack(
     *      net.minecraft.client.resources.IResourcePack)
     */
    @Override
    public boolean registerResourcePack(IResourcePack resourcePack)
    {
        if (!this.registeredResourcePacks.containsKey(resourcePack.func_130077_b()))
        {
            this.pendingResourceReload = true;

            List<IResourcePack> defaultResourcePacks = ((IMinecraft)this.engine).getDefaultResourcePacks();
            if (!defaultResourcePacks.contains(resourcePack))
            {
                defaultResourcePacks.add(resourcePack);
                this.registeredResourcePacks.put(resourcePack.func_130077_b(), resourcePack);
                return true;
            }
        }

        return false;
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.common.GameEngine#unRegisterResourcePack(
     *      net.minecraft.client.resources.IResourcePack)
     */
    @Override
    public boolean unRegisterResourcePack(IResourcePack resourcePack)
    {
        if (this.registeredResourcePacks.containsValue(resourcePack))
        {
            this.pendingResourceReload = true;

            List<IResourcePack> defaultResourcePacks = ((IMinecraft)this.engine).getDefaultResourcePacks();
            this.registeredResourcePacks.remove(resourcePack.func_130077_b());
            defaultResourcePacks.remove(resourcePack);
            return true;
        }

        return false;
    }
}
