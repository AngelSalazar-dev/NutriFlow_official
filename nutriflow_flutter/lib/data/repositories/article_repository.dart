import 'dart:convert';
import '../../core/network/api_client.dart';
import '../models/article_model.dart';

class ArticleRepository {
  final ApiClient _apiClient = ApiClient();

  Future<List<ArticleModel>> getArticles() async {
    final response = await _apiClient.get('/articles');
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['articles'] != null) {
        final List<dynamic> list = data['articles'];
        return list.map((json) => ArticleModel.fromJson(json)).toList();
      }
    }
    return [];
  }

  Future<ArticleModel?> getArticle(String slug) async {
    final response = await _apiClient.get('/articles/$slug');
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['article'] != null) {
        return ArticleModel.fromJson(data['article']);
      }
    }
    return null;
  }
}
