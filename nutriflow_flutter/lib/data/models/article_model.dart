class ArticleModel {
  final String id;
  final String title;
  final String slug;
  final String summary;
  final String content;
  final String category;
  final bool isPremium;
  final int readTimeMinutes;
  final DateTime createdAt;

  ArticleModel({
    required this.id,
    required this.title,
    required this.slug,
    required this.summary,
    required this.content,
    required this.category,
    required this.isPremium,
    required this.readTimeMinutes,
    required this.createdAt,
  });

  factory ArticleModel.fromJson(Map<String, dynamic> json) {
    return ArticleModel(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? '',
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      summary: json['summary'] ?? json['description'] ?? '',
      content: json['content'] ?? '',
      category: json['category'] ?? 'general',
      isPremium: json['is_premium'] == true || json['isPremium'] == true,
      readTimeMinutes: json['read_time_minutes'] ?? json['readTimeMinutes'] ?? 5,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
    );
  }
}
