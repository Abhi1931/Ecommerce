package com.example.ecommerce.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DeleteNotAllowedEx extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private final DeleteBlockReason reason;

    public DeleteNotAllowedEx(DeleteBlockReason reason, String message) {
        super(message);
        this.reason = reason;
    }

    public DeleteNotAllowedEx(DeleteBlockReason reason, String message, Throwable cause) {
        super(message, cause);
        this.reason = reason;
    }

    public DeleteBlockReason getReason() {
        return reason;
    }

    @Override
    public String toString() {
        return "DeleteNotAllowedEx{" + "reason=" + reason + ", message=" + getMessage() + '}';
    }
}
