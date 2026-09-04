import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../data/models/food_entry_model.dart';
import '../providers/auth_provider.dart';
import '../providers/food_log_provider.dart';

class FoodLogScreen extends StatefulWidget {
  const FoodLogScreen({super.key});

  @override
  State<FoodLogScreen> createState() => _FoodLogScreenState();
}

class _FoodLogScreenState extends State<FoodLogScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<Map<String, dynamic>> _searchResults = [];
  bool _isSearching = false;
  String? _searchError;

  // Library of food presets for one-tap logs
  final List<Map<String, dynamic>> _foodLibrary = [
    {'name': 'Oatmeal with Mixed Berries', 'portion': '1 bowl (250g)', 'calories': 310, 'protein': 10.0, 'carbs': 55.0, 'fat': 4.0},
    {'name': 'Grilled Salmon', 'portion': '1 serving (150g)', 'calories': 310, 'protein': 34.0, 'carbs': 0.0, 'fat': 18.0},
    {'name': 'Avocado Toast', 'portion': '1 slice', 'calories': 220, 'protein': 5.0, 'carbs': 24.0, 'fat': 12.0},
    {'name': 'Greek Yogurt with Honey', 'portion': '1 cup (200g)', 'calories': 180, 'protein': 15.0, 'carbs': 20.0, 'fat': 4.0},
    {'name': 'Whey Protein Shake', 'portion': '1 scoop (30g)', 'calories': 120, 'protein': 24.0, 'carbs': 3.0, 'fat': 1.5},
    {'name': 'Mixed Nuts', 'portion': '1 handful (30g)', 'calories': 172, 'protein': 6.0, 'carbs': 6.0, 'fat': 15.0},
    {'name': 'Grilled Chicken Breast', 'portion': '1 serving (150g)', 'calories': 250, 'protein': 46.0, 'carbs': 0.0, 'fat': 6.5},
    {'name': 'Black Coffee', 'portion': '1 cup (240ml)', 'calories': 5, 'protein': 0.3, 'carbs': 0.0, 'fat': 0.0},
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<FoodLogProvider>().fetchFoodLogs();
    });
  }

  void _showAddFoodDialog(String category) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.cardBg,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        bool showCustomForm = false;
        final formKey = GlobalKey<FormState>();
        
        final nameController = TextEditingController();
        final calController = TextEditingController();
        final protController = TextEditingController();
        final carbsController = TextEditingController();
        final fatController = TextEditingController();
        final portionController = TextEditingController(text: '1 serving');

        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
                top: 24,
                left: 24,
                right: 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          showCustomForm ? 'Custom Food to $category' : 'Add to $category',
                          style: const TextStyle(
                            fontFamily: 'Outfit',
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            setModalState(() {
                              showCustomForm = !showCustomForm;
                            });
                          },
                          child: Text(
                            showCustomForm ? 'Use Presets' : 'Create Custom',
                            style: const TextStyle(
                              color: AppTheme.primary,
                              fontFamily: 'Inter',
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    if (!showCustomForm) ...[
                      // Preset List
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxHeight: 300),
                        child: ListView.builder(
                          shrinkWrap: true,
                          itemCount: _foodLibrary.length,
                          itemBuilder: (context, index) {
                            final item = _foodLibrary[index];
                            return ListTile(
                              contentPadding: EdgeInsets.zero,
                              title: Text(
                                item['name'],
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14),
                              ),
                              subtitle: Text(
                                item['portion'],
                                style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                              ),
                              trailing: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  color: AppTheme.primary.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: AppTheme.primary.withValues(alpha: 0.2)),
                                ),
                                child: Text(
                                  '+${item['calories']} kcal',
                                  style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold, fontSize: 13),
                                ),
                              ),
                              onTap: () async {
                                final provider = Provider.of<FoodLogProvider>(context, listen: false);
                                Navigator.pop(context);
                                
                                try {
                                  await provider.logFoodItem(
                                    foodName: item['name'],
                                    calories: item['calories'],
                                    protein: item['protein'],
                                    carbs: item['carbs'],
                                    fat: item['fat'],
                                    servingSize: 1.0,
                                    servingName: item['portion'],
                                    mealType: category,
                                  );
                                  
                                  // Refresh today stats on dashboard too
                                  if (context.mounted) {
                                    context.read<AuthProvider>().checkSession();
                                  }
                                } catch (e) {
                                  if (context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text('Error: $e'),
                                        backgroundColor: AppTheme.tertiary,
                                      ),
                                    );
                                  }
                                }
                              },
                            );
                          },
                        ),
                      ),
                    ] else ...[
                      // Custom Entry Form
                      Form(
                        key: formKey,
                        child: Column(
                          children: [
                            TextFormField(
                              controller: nameController,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                labelText: 'Food Name',
                                hintText: 'e.g. Protein Pancake',
                              ),
                              validator: (val) => val == null || val.isEmpty ? 'Please enter a name' : null,
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: TextFormField(
                                    controller: calController,
                                    keyboardType: TextInputType.number,
                                    style: const TextStyle(color: Colors.white),
                                    decoration: const InputDecoration(labelText: 'Calories (kcal)'),
                                    validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: TextFormField(
                                    controller: portionController,
                                    style: const TextStyle(color: Colors.white),
                                    decoration: const InputDecoration(labelText: 'Serving Name', hintText: 'e.g. 1 plate'),
                                    validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: TextFormField(
                                    controller: protController,
                                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                    style: const TextStyle(color: Colors.white),
                                    decoration: const InputDecoration(labelText: 'Protein (g)'),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: TextFormField(
                                    controller: carbsController,
                                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                    style: const TextStyle(color: Colors.white),
                                    decoration: const InputDecoration(labelText: 'Carbs (g)'),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: TextFormField(
                                    controller: fatController,
                                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                    style: const TextStyle(color: Colors.white),
                                    decoration: const InputDecoration(labelText: 'Fat (g)'),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                ),
                                onPressed: () async {
                                  if (formKey.currentState?.validate() == true) {
                                    final provider = Provider.of<FoodLogProvider>(context, listen: false);
                                    Navigator.pop(context);

                                    try {
                                      await provider.logFoodItem(
                                        foodName: nameController.text,
                                        calories: int.parse(calController.text),
                                        protein: double.tryParse(protController.text) ?? 0.0,
                                        carbs: double.tryParse(carbsController.text) ?? 0.0,
                                        fat: double.tryParse(fatController.text) ?? 0.0,
                                        servingSize: 1.0,
                                        servingName: portionController.text,
                                        mealType: category,
                                      );
                                    } catch (e) {
                                      if (context.mounted) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(
                                            content: Text('Error: $e'),
                                            backgroundColor: AppTheme.tertiary,
                                          ),
                                        );
                                      }
                                    }
                                  }
                                },
                                child: const Text(
                                  'Save Log Entry',
                                  style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ]
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final foodLogProvider = Provider.of<FoodLogProvider>(context);

    final user = authProvider.currentUser;
    final int calorieGoal = user?.calorieGoal ?? 2000;

    final int totalConsumed = foodLogProvider.caloriesConsumed;
    final double totalProtein = foodLogProvider.totalProtein;
    final double totalCarbs = foodLogProvider.totalCarbs;
    final double totalFat = foodLogProvider.totalFat;

    int left = calorieGoal - totalConsumed;
    double progress = calorieGoal > 0 ? (totalConsumed / calorieGoal).clamp(0.0, 1.0) : 0.0;

    final breakfastLogs = foodLogProvider.getLogsByMealType('Breakfast');
    final lunchLogs = foodLogProvider.getLogsByMealType('Lunch');
    final dinnerLogs = foodLogProvider.getLogsByMealType('Dinner');
    final snacksLogs = foodLogProvider.getLogsByMealType('Snacks');

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
              'NutriFlow',
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
            icon: const Icon(Icons.refresh_rounded, color: Colors.white),
            onPressed: () => foodLogProvider.fetchFoodLogs(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => foodLogProvider.fetchFoodLogs(),
        color: AppTheme.primary,
        backgroundColor: AppTheme.cardBg,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Daily Log',
                        style: TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Today\'s Meals',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.calendar_today_rounded, color: AppTheme.primary, size: 20),
                    onPressed: () {},
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Calorie progress banner
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.cardBg,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'CALORIES',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.textMuted,
                              letterSpacing: 1.2,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Text(
                                '$totalConsumed ',
                                style: const TextStyle(
                                  fontFamily: 'Outfit',
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              Text(
                                '/ $calorieGoal',
                                style: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 14,
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Icon(
                                totalConsumed <= calorieGoal ? Icons.check_circle_outline : Icons.warning_amber_rounded,
                                color: totalConsumed <= calorieGoal ? AppTheme.primary : AppTheme.tertiary,
                                size: 14,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                totalConsumed <= calorieGoal ? 'On track' : 'Goal exceeded',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 12,
                                  color: totalConsumed <= calorieGoal ? AppTheme.primary : AppTheme.tertiary,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    SizedBox(
                      height: 80,
                      width: 80,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          CircularProgressIndicator(
                            value: progress,
                            strokeWidth: 8,
                            backgroundColor: AppTheme.border,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              totalConsumed <= calorieGoal ? AppTheme.primary : AppTheme.tertiary,
                            ),
                          ),
                          Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                left.abs().toString(),
                                style: const TextStyle(
                                  fontFamily: 'Outfit',
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              Text(
                                left >= 0 ? 'left' : 'over',
                                style: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 10,
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Mini macros progress
              Row(
                children: [
                  Expanded(
                    child: _buildMiniMacro(
                      'Protein',
                      totalProtein,
                      ((calorieGoal * 0.3) / 4),
                      AppTheme.primary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMiniMacro(
                      'Carbs',
                      totalCarbs,
                      ((calorieGoal * 0.4) / 4),
                      Colors.cyan,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMiniMacro(
                      'Fat',
                      totalFat,
                      ((calorieGoal * 0.3) / 9),
                      Colors.orange,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Search & Smart Log
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.cardBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Column(
                  children: [
                    TextField(
                      controller: _searchController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        hintText: 'Search foods...',
                        hintStyle: const TextStyle(color: AppTheme.textMuted),
                        prefixIcon: const Icon(Icons.search, color: AppTheme.textMuted),
                        suffixIcon: _searchController.text.isNotEmpty || _isSearching
                            ? IconButton(
                                icon: const Icon(Icons.close, color: AppTheme.textMuted),
                                onPressed: () {
                                  _searchController.clear();
                                  setState(() {
                                    _searchResults = [];
                                    _searchError = null;
                                  });
                                },
                              )
                            : null,
                        filled: true,
                        fillColor: AppTheme.background,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide.none,
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: AppTheme.primary, width: 1.5),
                        ),
                      ),
                      onSubmitted: (query) async {
                        if (query.trim().isEmpty) return;
                        setState(() {
                          _isSearching = true;
                          _searchError = null;
                        });
                        try {
                          final results = await context.read<FoodLogProvider>().searchFood(query);
                          setState(() {
                            _searchResults = results;
                            _isSearching = false;
                          });
                        } catch (e) {
                          setState(() {
                            _searchError = e.toString();
                            _isSearching = false;
                          });
                        }
                      },
                    ),
                    if (_isSearching)
                      const Padding(
                        padding: EdgeInsets.all(12),
                        child: SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.primary)),
                      )
                    else if (_searchError != null)
                      Padding(
                        padding: const EdgeInsets.all(8),
                        child: Text(_searchError!, style: const TextStyle(color: AppTheme.tertiary, fontSize: 12)),
                      )
                    else if (_searchResults.isNotEmpty)
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxHeight: 200),
                        child: ListView.builder(
                          shrinkWrap: true,
                          itemCount: _searchResults.length,
                          itemBuilder: (context, index) {
                            final item = _searchResults[index];
                            final name = item['name'] ?? item['foodName'] ?? '';
                            final cals = item['calories'] ?? 0;
                            return ListTile(
                              dense: true,
                              contentPadding: EdgeInsets.zero,
                              title: Text(name, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
                              trailing: Text('$cals kcal', style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold, fontSize: 12)),
                              onTap: () async {
                                final provider = context.read<FoodLogProvider>();
                                try {
                                  await provider.logFoodItem(
                                    foodName: name,
                                    calories: cals is int ? cals : (cals as num).toInt(),
                                    protein: (item['protein'] ?? 0).toDouble(),
                                    carbs: (item['carbs'] ?? 0).toDouble(),
                                    fat: (item['fat'] ?? 0).toDouble(),
                                    servingSize: 1.0,
                                    servingName: item['servingSize']?.toString() ?? '1 serving',
                                    mealType: 'Snack',
                                  );
                                  _searchController.clear();
                                  setState(() => _searchResults = []);
                                } catch (e) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Error: $e'), backgroundColor: AppTheme.tertiary),
                                  );
                                }
                              },
                            );
                          },
                        ),
                      ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.primary,
                          side: const BorderSide(color: AppTheme.primary),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.auto_awesome, size: 16),
                        label: const Text('Smart Log: describe your meal', style: TextStyle(fontFamily: 'Inter', fontSize: 12)),
                        onPressed: () => _showSmartLogDialog(),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Interactive categories
              _buildMealCategorySection('Breakfast', breakfastLogs, foodLogProvider),
              _buildMealCategorySection('Lunch', lunchLogs, foodLogProvider),
              _buildMealCategorySection('Dinner', dinnerLogs, foodLogProvider),
              _buildMealCategorySection('Snacks', snacksLogs, foodLogProvider),
            ],
          ),
        ),
      ),
    );
  }

  void _showSmartLogDialog() {
    final descriptionController = TextEditingController();
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.cardBg,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 24,
            top: 24,
            left: 24,
            right: 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Smart Log',
                style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const SizedBox(height: 4),
              const Text(
                'Describe your meal in natural language',
                style: TextStyle(fontFamily: 'Inter', fontSize: 13, color: AppTheme.textSecondary),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: descriptionController,
                maxLines: 3,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'e.g. "I had 200g chicken breast with rice and broccoli for lunch"',
                  hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  filled: true,
                  fillColor: AppTheme.background,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppTheme.primary, width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () async {
                    final text = descriptionController.text.trim();
                    if (text.isEmpty) return;
                    final provider = Provider.of<FoodLogProvider>(context, listen: false);
                    Navigator.pop(ctx);
                    try {
                      await provider.smartLog(text);
                      if (ctx.mounted) {
                        ScaffoldMessenger.of(ctx).showSnackBar(
                          const SnackBar(content: Text('Meal logged via AI!'), backgroundColor: AppTheme.primary),
                        );
                      }
                    } catch (e) {
                      if (ctx.mounted) {
                        ScaffoldMessenger.of(ctx).showSnackBar(
                          SnackBar(content: Text('Error: $e'), backgroundColor: AppTheme.tertiary),
                        );
                      }
                    }
                  },
                  child: const Text('Log with AI', style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMiniMacro(String name, double current, double target, Color color) {
    double pct = target > 0 ? current / target : 0.0;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              name,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppTheme.textSecondary,
              ),
            ),
            Text(
              '${current.round()}g/${target.round()}g',
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 10,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: SizedBox(
            height: 4,
            child: LinearProgressIndicator(
              value: pct.clamp(0.0, 1.0),
              backgroundColor: AppTheme.border,
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMealCategorySection(String title, List<FoodEntryModel> items, FoodLogProvider provider) {
    int totalKcal = items.fold(0, (sum, element) => sum + element.calories);

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: AppTheme.cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 16, right: 8, top: 12, bottom: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      '$totalKcal kcal',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.add_circle_outline_rounded, color: AppTheme.primary, size: 22),
                  onPressed: () => _showAddFoodDialog(title),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppTheme.border),
          if (items.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 24),
              child: Center(
                child: Text(
                  'No items logged yet',
                  style: TextStyle(fontFamily: 'Inter', color: AppTheme.textMuted, fontSize: 13),
                ),
              ),
            )
          else
            ListView.builder(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                return Column(
                  children: [
                    ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      title: Text(
                        item.foodName,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      subtitle: Text(
                        '${item.servingSize} ${item.servingName}',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '${item.calories} ',
                            style: const TextStyle(
                              fontFamily: 'Outfit',
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const Text(
                            'kcal',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 11,
                              color: AppTheme.textSecondary,
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.remove_circle_outline, color: AppTheme.tertiary, size: 18),
                            onPressed: () => provider.removeFoodItem(item.id),
                          ),
                        ],
                      ),
                    ),
                    if (index < items.length - 1)
                      const Divider(height: 1, indent: 16, endIndent: 16, color: AppTheme.border),
                  ],
                );
              },
            ),
        ],
      ),
    );
  }
}
