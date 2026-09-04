import 'package:flutter/material.dart';
import '../../data/models/article_model.dart';
import '../../data/repositories/article_repository.dart';

class ArticleProvider with ChangeNotifier {
  final ArticleRepository _repository = ArticleRepository();

  List<ArticleModel> _articles = [];
  ArticleModel? _selectedArticle;
  bool _isLoading = false;
  String? _errorMessage;

  List<ArticleModel> get articles => _articles;
  ArticleModel? get selectedArticle => _selectedArticle;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchArticles() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _articles = await _repository.getArticles();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchArticle(String slug) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _selectedArticle = await _repository.getArticle(slug);
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
