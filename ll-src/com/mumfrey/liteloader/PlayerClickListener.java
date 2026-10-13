/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader;

import com.mumfrey.liteloader.PlayerInteractionListener.MouseButton;

import net.minecraft.client.entity.EntityPlayerSP;

/**
 * Interface for mods which want to listen for and intercept mouse events on the
 * client side <em>before</em> they trigger remote actions, or otherwise just
 * be notified that a click is about to be dispatched. 
 *
 * @author Adam Mummery-Smith
 */
public interface PlayerClickListener extends LiteMod
{
    /**
     * For left, middle and right clicks. Called when the click event is
     * processed, before any handling has been done. Note that the context of
     * the click can be obtained from:
     * 
     * <ul>
     *   <li><tt>Minecraft.objectMouseOver</tt> the object currently under
     *     cursor.</li>
     *   <li><tt>EntityUtilities.rayTraceFromEntity</tt> using the supplied
     *     player is useful to determine objects under the cursor at longer
     *     distances than the player's reach.</li>
     *   <li><tt>player.isRowingBoat()</tt> is used to inhibit a lot of vanilla
     *     click behaviour and is worth checking state if acting upon clicks.
     *   </li>
     * </ul>
     * 
     * @param player The local player
     * @param button The mouse button which was clicked
     * @return true to allow the click to be processed normally, false to
     *      inhibit further processing of the click. Other listeners will still
     *      be notified.
     */
    public abstract boolean onMouseClicked(EntityPlayerSP player, MouseButton button);

    /**
     * For left and right clicks only, when the player holds the key down the
     * game periodically processes additional events (eg. mining), this event is
     * raised after the initial click when the mouse button is held down.
     * 
     * @param player The local player
     * @param button The mouse button being held, only valid for LEFT and RIGHT
     * @return true to allow the button held event to be processed normally,
     *      false to inhibit further processing of the click. Other listeners
     *      will still be notified.
     */
    public abstract boolean onMouseHeld(EntityPlayerSP player, MouseButton button);
}
