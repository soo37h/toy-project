package com.farmzonesnc.axtoy.app.exception;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String code,
        String message,
        List<FieldErrorResponse> errors
) {

    public static ErrorResponse of(
            int status,
            String code,
            String message,
            List<FieldErrorResponse> errors
    ) {
        return new ErrorResponse(
                LocalDateTime.now(),
                status,
                code,
                message,
                errors
        );
    }

    public static ErrorResponse of(
            int status,
            String code,
            String message
    ) {
        return new ErrorResponse(
                LocalDateTime.now(),
                status,
                code,
                message,
                List.of()
        );
    }
}
