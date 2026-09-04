class ChatMessageModel {
  final String id;
  final String role;
  final String content;
  final String conversationId;
  final DateTime createdAt;

  ChatMessageModel({
    required this.id,
    required this.role,
    required this.content,
    required this.conversationId,
    required this.createdAt,
  });

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) {
    return ChatMessageModel(
      id: json['id']?.toString() ?? '',
      role: json['role'] ?? 'user',
      content: json['content'] ?? '',
      conversationId: json['conversationId'] ?? json['conversation_id'] ?? '',
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at']) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'role': role,
      'content': content,
      'conversationId': conversationId,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
