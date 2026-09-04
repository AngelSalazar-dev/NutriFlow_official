import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../providers/article_provider.dart';

class ArticleDetailScreen extends StatefulWidget {
  final String slug;

  const ArticleDetailScreen({super.key, required this.slug});

  @override
  State<ArticleDetailScreen> createState() => _ArticleDetailScreenState();
}

class _ArticleDetailScreenState extends State<ArticleDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ArticleProvider>().fetchArticle(widget.slug);
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ArticleProvider>(context);
    final article = provider.selectedArticle;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: provider.isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
          : article == null
              ? const Center(
                  child: Text('Article not found', style: TextStyle(color: AppTheme.textSecondary)),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (article.isPremium)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.yellowAccent.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.yellowAccent.withValues(alpha: 0.3)),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.star, color: Colors.yellowAccent, size: 16),
                              SizedBox(width: 4),
                              Text(
                                'Premium Article',
                                style: TextStyle(fontFamily: 'Inter', fontSize: 11, fontWeight: FontWeight.bold, color: Colors.yellowAccent),
                              ),
                            ],
                          ),
                        ),
                      const SizedBox(height: 16),
                      Text(
                        article.title,
                        style: const TextStyle(fontFamily: 'Outfit', fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white, height: 1.2),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.primary.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              article.category.toUpperCase(),
                              style: const TextStyle(fontFamily: 'Inter', fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.primary),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            '${article.readTimeMinutes} min read',
                            style: const TextStyle(fontFamily: 'Inter', fontSize: 12, color: AppTheme.textMuted),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        article.summary,
                        style: const TextStyle(fontFamily: 'Inter', fontSize: 14, color: AppTheme.textSecondary, height: 1.5),
                      ),
                      const SizedBox(height: 24),
                      const Divider(color: AppTheme.border),
                      const SizedBox(height: 16),
                      Text(
                        article.content,
                        style: const TextStyle(fontFamily: 'Inter', fontSize: 15, color: Colors.white, height: 1.7),
                      ),
                    ],
                  ),
                ),
    );
  }
}
