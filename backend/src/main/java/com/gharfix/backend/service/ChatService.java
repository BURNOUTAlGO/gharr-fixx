package com.gharfix.backend.service;

import com.gharfix.backend.entity.Booking;
import com.gharfix.backend.entity.Message;
import com.gharfix.backend.entity.User;
import com.gharfix.backend.repository.BookingRepository;
import com.gharfix.backend.repository.MessageRepository;
import com.gharfix.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    public Message sendMessage(Long senderId, Long receiverId, Long bookingId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        Booking booking = bookingId != null ? bookingRepository.findById(bookingId).orElse(null) : null;

        // Clean quotes if content is wrapped in quotes from JSON payload
        String cleanContent = content;
        if (cleanContent != null && cleanContent.startsWith("\"") && cleanContent.endsWith("\"") && cleanContent.length() >= 2) {
            cleanContent = cleanContent.substring(1, cleanContent.length() - 1);
        }

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .booking(booking)
                .content(cleanContent)
                .read(false)
                .build();

        Message savedMessage = messageRepository.save(message);

        // Notify receiver & sender via WebSocket user queue
        try {
            messagingTemplate.convertAndSendToUser(
                    receiver.getEmail(),
                    "/queue/messages",
                    savedMessage
            );
            messagingTemplate.convertAndSendToUser(
                    sender.getEmail(),
                    "/queue/messages",
                    savedMessage
            );
            
            // Topic broadcast fallback
            messagingTemplate.convertAndSend("/topic/messages/" + receiver.getId(), savedMessage);
            messagingTemplate.convertAndSend("/topic/messages/" + sender.getId(), savedMessage);
        } catch (Exception e) {
            // Log warning if websocket broadcast fails
        }

        // Send a persistent notification to the receiver
        notificationService.sendNotification(
                receiver,
                "New Message",
                "New message from " + sender.getName(),
                "NEW_MESSAGE",
                bookingId
        );

        return savedMessage;
    }

    public List<Message> getConversation(Long userId, Long otherUserId) {
        return messageRepository.findConversation(userId, otherUserId);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }
}
