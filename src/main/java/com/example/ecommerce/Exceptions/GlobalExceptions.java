package com.example.ecommerce.Exceptions;

import io.jsonwebtoken.JwtException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptions {

    private Map<String, Object> baseBody(HttpStatus status, String message) {
        Map<String,Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return body;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleNotFound(ResourceNotFoundException ex) {
        Map<String,Object> response = baseBody(HttpStatus.NOT_FOUND, ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DeleteNotAllowedEx.class)
    public ResponseEntity<Map<String,Object>> handleDeleteNotAllowed(DeleteNotAllowedEx ex) {
        Map<String,Object> resp = new HashMap<>();
        resp.put("status", HttpStatus.CONFLICT.value());
        resp.put("message", ex.getMessage());
        resp.put("reason", ex.getReason().name());
        return new ResponseEntity<>(resp, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String,Object>> handleJwt(JwtException ex) {
        Map<String,Object> response = baseBody(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        // optionally include cause message for debugging (avoid in prod)
        response.put("detail", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String,Object>> handleIllegalArg(IllegalArgumentException ex) {
        Map<String,Object> response = baseBody(HttpStatus.BAD_REQUEST, ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String,Object>> handleAccessDenied(AccessDeniedException ex) {
        Map<String,Object> response = baseBody(HttpStatus.FORBIDDEN, "Access denied");
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String,Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        String root = null;
        if (ex.getMostSpecificCause() != null) {
            root = ex.getMostSpecificCause().getMessage();
        }
        Map<String,Object> response = baseBody(HttpStatus.CONFLICT,
                "Database constraint violation" + (root != null ? ": " + root : ""));
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String,Object> response = baseBody(HttpStatus.BAD_REQUEST, "Validation failed");
        Map<String,String> errors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            errors.put(fe.getField(), fe.getDefaultMessage());
        }
        response.put("errors", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalExceptions(Exception ex) {

        ex.printStackTrace();
        Map<String, Object> response = baseBody(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
        response.put("detail", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
