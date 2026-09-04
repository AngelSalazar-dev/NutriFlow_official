import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../providers/auth_provider.dart';
import '../providers/ai_chat_provider.dart';

class AIChatScreen extends StatefulWidget {
  const AIChatScreen({super.key});

  @override
  State<AIChatScreen> createState() => _AIChatScreenState();
}

class _AIChatScreenState extends State<AIChatScreen> {
  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<String> _suggestions = [
    "Cena saludable de 400kcal",
    "Snacks altos en proteína",
    "Consejo para quemar grasa",
  ];

  @override
  void initState() {
    super.initState();
    // Scroll to bottom on initial load
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
  }

  void _sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    final provider = Provider.of<AiChatProvider>(context, listen: false);
    _inputController.clear();
    _scrollToBottom();
    
    await provider.sendMessage(text);
    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final aiChatProvider = Provider.of<AiChatProvider>(context);

    final user = authProvider.currentUser;
    final messages = aiChatProvider.messages;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16.0, top: 8.0, bottom: 8.0),
          child: CircleAvatar(
            backgroundColor: AppTheme.primary.withValues(alpha: 0.2),
            child: Text(
              user?.name.isNotEmpty == true ? user!.name[0].toUpperCase() : 'U',
              style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold),
            ),
          ),
        ),
        title: Row(
          children: [
            const Icon(Icons.spa, color: AppTheme.primary, size: 24),
            const SizedBox(width: 6),
            const Text(
              'NutriBot AI',
              style: TextStyle(
                fontFamily: 'Outfit',
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded, color: AppTheme.tertiary),
            tooltip: 'Clear conversation',
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  backgroundColor: AppTheme.cardBg,
                  title: const Text('Reset Conversation', style: TextStyle(color: Colors.white, fontFamily: 'Outfit')),
                  content: const Text(
                    'Are you sure you want to clear your current NutriBot AI chat session?',
                    style: TextStyle(color: AppTheme.textSecondary, fontFamily: 'Inter'),
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel', style: TextStyle(color: Colors.white)),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.tertiary),
                      onPressed: () {
                        aiChatProvider.clearConversation();
                        Navigator.pop(context);
                      },
                      child: const Text('Reset', style: TextStyle(color: Colors.white)),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Chat messages list
          Expanded(
            child: messages.isEmpty
                ? const Center(
                    child: Text(
                      'Say hi to NutriBot!',
                      style: TextStyle(color: AppTheme.textMuted, fontFamily: 'Inter'),
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final message = messages[index];
                      final bool isUser = message['role'] == 'user';
                      return _buildMessageBubble(message['content'] ?? '', isUser);
                    },
                  ),
          ),

          // Typing Loader
          if (aiChatProvider.isLoading)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.border),
                  ),
                  child: const SizedBox(
                    height: 18,
                    width: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primary),
                    ),
                  ),
                ),
              ),
            ),

          // Suggestion Chips
          if (messages.length <= 1 && !aiChatProvider.isLoading)
            Container(
              height: 48,
              padding: const EdgeInsets.only(left: 16, bottom: 8),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _suggestions.length,
                itemBuilder: (context, index) {
                  final suggestion = _suggestions[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ActionChip(
                      backgroundColor: AppTheme.cardBg,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: const BorderSide(color: AppTheme.border),
                      ),
                      label: Text(
                        suggestion,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      onPressed: () => _sendMessage(suggestion),
                    ),
                  );
                },
              ),
            ),

          // Input Bar
          Container(
            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 20, top: 8),
            decoration: const BoxDecoration(
              color: AppTheme.background,
              border: Border(
                top: BorderSide(color: AppTheme.border, width: 0.5),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _inputController,
                    onSubmitted: _sendMessage,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Ask about your diet...',
                      filled: true,
                      fillColor: AppTheme.cardBg,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: const BorderSide(color: AppTheme.border),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: const BorderSide(color: AppTheme.border),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: const BorderSide(color: AppTheme.primary),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                GestureDetector(
                  onTap: () => _sendMessage(_inputController.text),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: const BoxDecoration(
                      color: AppTheme.primary,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.arrow_upward_rounded,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(String text, bool isUser) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isUser ? AppTheme.primary : AppTheme.cardBg,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(20),
            topRight: const Radius.circular(20),
            bottomLeft: Radius.circular(isUser ? 20 : 4),
            bottomRight: Radius.circular(isUser ? 4 : 20),
          ),
          border: isUser ? null : Border.all(color: AppTheme.border),
        ),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        child: Text(
          text,
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 14,
            color: Colors.white,
            height: 1.4,
          ),
        ),
      ),
    );
  }
}
