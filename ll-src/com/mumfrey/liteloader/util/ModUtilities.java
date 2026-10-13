/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.util;

import java.util.Map;

import org.lwjgl.LWJGLException;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.DisplayMode;

import com.mumfrey.liteloader.client.ducks.IRenderManager;
import com.mumfrey.liteloader.client.ducks.ITileEntityRendererDispatcher;
import com.mumfrey.liteloader.client.overlays.IMinecraft;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;

import net.minecraft.client.Minecraft;
import net.minecraft.client.renderer.entity.Render;
import net.minecraft.client.renderer.entity.RenderManager;
import net.minecraft.client.renderer.tileentity.TileEntityRendererDispatcher;
import net.minecraft.client.renderer.tileentity.TileEntitySpecialRenderer;
import net.minecraft.entity.Entity;
import net.minecraft.tileentity.TileEntity;

/**
 * A small collection of useful functions for mods
 * 
 * @author Adam Mummery-Smith
 */
public abstract class ModUtilities
{
    /**
     * @return true if FML is present in the current environment
     */
    public static boolean fmlIsPresent()
    {
        return ObfuscationUtilities.fmlIsPresent();
    }

    public static void setWindowSize(int width, int height)
    {
        try
        {
            Display.setResizable(false);
            Minecraft mc = Minecraft.func_71410_x();
            Display.setDisplayMode(new DisplayMode(width, height));
            ((IMinecraft)mc).onResizeWindow(width, height);
            Display.setVSyncEnabled(mc.field_71474_y.field_74352_v);
            Display.setResizable(true);
        }
        catch (LWJGLException ex)
        {
            ex.printStackTrace();
        }
    }

    /**
     * Add a renderer map entry for the specified entity class
     * 
     * @param entityClass
     * @param renderer
     */
    public static <T extends Entity> void addRenderer(Class<T> entityClass, Render<T> renderer)
    {
        RenderManager renderManager = Minecraft.func_71410_x().func_175598_ae();

        Map<Class<? extends Entity>, Render<? extends Entity>> entityRenderMap = ((IRenderManager)renderManager).getRenderMap();
        if (entityRenderMap != null)
        {
            entityRenderMap.put(entityClass, renderer);
        }
        else
        {
            LiteLoaderLogger.warning("Attempted to set renderer %s for entity class %s but the operation failed",
                    renderer.getClass().getSimpleName(), entityClass.getSimpleName());
        }
    }

    public static <T extends TileEntity> void addRenderer(Class<T> tileEntityClass, TileEntitySpecialRenderer<T> renderer)
    {
        TileEntityRendererDispatcher tileEntityRenderer = TileEntityRendererDispatcher.field_147556_a;

        try
        {
            Map<Class<? extends TileEntity>, TileEntitySpecialRenderer<? extends TileEntity>> specialRendererMap
                    = ((ITileEntityRendererDispatcher)tileEntityRenderer).getSpecialRenderMap();
            specialRendererMap.put(tileEntityClass, renderer);
            renderer.func_147497_a(tileEntityRenderer);
        }
        catch (Exception ex)
        {
            LiteLoaderLogger.warning("Attempted to set renderer %s for tile entity class %s but the operation failed",
                    renderer.getClass().getSimpleName(), tileEntityClass.getSimpleName());
        }
    }
}
