import 'package:flutter/material.dart';
import '../../data/repositories/chat_repository.dart';

class AiChatProvider with ChangeNotifier {
  final ChatRepository _chatRepository = ChatRepository();

  final List<Map<String, dynamic>> _messages = [
    {
      'role': 'assistant',
      'content': '¡Hola! Soy NutriBot, tu coach personal de nutrición y salud impulsado por Inteligencia Artificial. ¿En qué puedo ayudarte hoy?',
    }
  ];
  
  bool _isLoading = false;
  String? _errorMessage;
  String? _conversationId;
  Map<String, dynamic>? _usage;

  List<Map<String, dynamic>> get messages => _messages;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  Map<String, dynamic>? get usage => _usage;

  Future<void> sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    // Append User Message optimistically
    _messages.add({'role': 'user', 'content': text});
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // Build session context (excluding greetings if unnecessary)
      final historyList = _messages
          .sublist(0, _messages.length - 1)
          .map((m) => {'role': m['role'], 'content': m['content']})
          .toList();

      final result = await _chatRepository.sendMessage(
        text,
        history: historyList,
        conversationId: _conversationId,
      );

      _conversationId = result['conversationId'];
      
      // Append AI Response
      _messages.add({
        'role': 'assistant',
        'content': result['message'],
      });
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _messages.add({
        'role': 'assistant',
        'content': 'Lo siento, ha ocurrido un error al procesar tu solicitud: $_errorMessage. Por favor inténtalo de nuevo.',
      });
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearConversation() {
    _messages.clear();
    _messages.add({
      'role': 'assistant',
      'content': '¡Hola de nuevo! Iniciemos un nuevo plan nutricional. ¿De qué te gustaría conversar hoy?',
    });
    _conversationId = null;
    notifyListeners();
  }
}
