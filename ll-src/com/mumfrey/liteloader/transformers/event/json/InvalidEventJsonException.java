/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.transformers.event.json;

public class InvalidEventJsonException extends RuntimeException
{
    private static final long serialVersionUID = 1L;

    public InvalidEventJsonException()
    {
    }

    public InvalidEventJsonException(String message)
    {
        super(message);
    }

    public InvalidEventJsonException(Throwable cause)
    {
        super(cause);
    }

    public InvalidEventJsonException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
