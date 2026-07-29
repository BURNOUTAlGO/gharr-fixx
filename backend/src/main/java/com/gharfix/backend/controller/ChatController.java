package com.gharfix.backend.controller;

import com.gharfix.backend.entity.Message;
import com.gharfix.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.gharfix.backend.entity.User;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam(required = false) Long bookingId,
            @RequestBody String content) {
        return ResponseEntity.ok(chatService.sendMessage(senderId, receiverId, bookingId, content));
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam Long userId,
            @RequestParam Long otherUserId) {
        return ResponseEntity.ok(chatService.getConversation(userId, otherUserId));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.getUserById(id));
    }
}
