import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../providers/article_provider.dart';
import 'article_detail_screen.dart';

class ArticlesScreen extends StatefulWidget {
  const ArticlesScreen({super.key});

  @override
  State<ArticlesScreen> createState() => _ArticlesScreenState();
}

class _ArticlesScreenState extends State<ArticlesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ArticleProvider>().fetchArticles();
    });
  }

  final categoryColors = {
    'nutrition': AppTheme.primary,
    'exercise': Colors.orange,
    'wellness': Colors.purple,
    'recipes': Colors.cyan,
    'general': AppTheme.textSecondary,
  };

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ArticleProvider>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Row(
          children: [
            Icon(Icons.article_outlined, color: AppTheme.primary, size: 24),
            SizedBox(width: 8),
            Text(
              'Articles',
              style: TextStyle(fontFamily: 'Outfit', fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
            ),
          ],
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () => provider.fetchArticles(),
        color: AppTheme.primary,
        backgroundColor: AppTheme.cardBg,
        child: provider.isLoading
            ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
            : provider.articles.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.article_outlined, size: 64, color: AppTheme.textMuted),
                        const SizedBox(height: 16),
                        const Text(
                          'No articles yet',
                          style: TextStyle(fontFamily: 'Outfit', fontSize: 18, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: provider.articles.length,
                    itemBuilder: (context, index) {
                      final article = provider.articles[index];
                      final catColor = categoryColors[article.category] ?? AppTheme.textSecondary;

                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ArticleDetailScreen(slug: article.slug),
                            ),
                          );
                        },
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.cardBg,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppTheme.border),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 4,
                                height: 60,
                                decoration: BoxDecoration(
                                  color: catColor,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: catColor.withValues(alpha: 0.15),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            article.category.toUpperCase(),
                                            style: TextStyle(fontFamily: 'Inter', fontSize: 9, fontWeight: FontWeight.bold, color: catColor),
                                          ),
                                        ),
                                        if (article.isPremium) ...[
                                          const SizedBox(width: 6),
                                          const Icon(Icons.star, color: Colors.yellowAccent, size: 14),
                                        ],
                                        const Spacer(),
                                        Text(
                                          '${article.readTimeMinutes} min',
                                          style: const TextStyle(fontFamily: 'Inter', fontSize: 11, color: AppTheme.textMuted),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      article.title,
                                      style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      article.summary,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(fontFamily: 'Inter', fontSize: 12, color: AppTheme.textSecondary),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(Icons.chevron_right, color: AppTheme.textMuted),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
