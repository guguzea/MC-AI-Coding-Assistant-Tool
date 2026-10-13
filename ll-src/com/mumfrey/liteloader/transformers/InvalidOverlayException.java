/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.transformers;

/**
 *
 * @author Adam Mummery-Smith
 */
public class InvalidOverlayException extends RuntimeException
{
    private static final long serialVersionUID = 1L;

    public InvalidOverlayException(String message)
    {
        super(message);
    }

    public InvalidOverlayException(Throwable cause)
    {
        super(cause);
    }

    public InvalidOverlayException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
