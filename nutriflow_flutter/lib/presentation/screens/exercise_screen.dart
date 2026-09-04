import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../providers/auth_provider.dart';
import '../providers/exercise_provider.dart';

class ExerciseScreen extends StatefulWidget {
  const ExerciseScreen({super.key});

  @override
  State<ExerciseScreen> createState() => _ExerciseScreenState();
}

class _ExerciseScreenState extends State<ExerciseScreen> {
  final List<Map<String, dynamic>> _exerciseTypes = [
    {'name': 'Cardio', 'icon': Icons.directions_run, 'color': Colors.orange},
    {'name': 'Strength', 'icon': Icons.fitness_center, 'color': AppTheme.primary},
    {'name': 'Flexibility', 'icon': Icons.self_improvement, 'color': Colors.purple},
    {'name': 'Sports', 'icon': Icons.sports_soccer, 'color': Colors.blue},
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ExerciseProvider>().fetchTodayLogs();
    });
  }

  void _showAddExerciseDialog() {
    final nameController = TextEditingController();
    final durationController = TextEditingController();
    String selectedType = 'Cardio';
    final Set<String> selectedMuscles = {};

    final muscleOptions = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Full Body'];

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.cardBg,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
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
                    const Text(
                      'Log Exercise',
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: nameController,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        labelText: 'Exercise Name',
                        hintText: 'e.g. Bench Press, Running',
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Type selection
                    const Text('Type', style: TextStyle(color: AppTheme.textSecondary, fontFamily: 'Inter', fontSize: 13)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: _exerciseTypes.map((type) {
                        final isSelected = selectedType == type['name'];
                        return ChoiceChip(
                          label: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(type['icon'] as IconData, size: 16, color: isSelected ? Colors.white : type['color'] as Color),
                              const SizedBox(width: 4),
                              Text(type['name'] as String),
                            ],
                          ),
                          selected: isSelected,
                          selectedColor: type['color'] as Color,
                          backgroundColor: AppTheme.background,
                          labelStyle: TextStyle(color: isSelected ? Colors.white : AppTheme.textSecondary, fontSize: 12),
                          onSelected: (val) => setModalState(() => selectedType = type['name'] as String),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: durationController,
                      keyboardType: TextInputType.number,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        labelText: 'Duration (minutes)',
                        hintText: 'e.g. 30',
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text('Muscle Groups', style: TextStyle(color: AppTheme.textSecondary, fontFamily: 'Inter', fontSize: 13)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: muscleOptions.map((muscle) {
                        final isSelected = selectedMuscles.contains(muscle);
                        return FilterChip(
                          label: Text(muscle, style: const TextStyle(fontSize: 12)),
                          selected: isSelected,
                          selectedColor: AppTheme.primary.withValues(alpha: 0.3),
                          checkmarkColor: AppTheme.primary,
                          backgroundColor: AppTheme.background,
                          labelStyle: TextStyle(color: isSelected ? AppTheme.primary : AppTheme.textSecondary),
                          onSelected: (val) {
                            setModalState(() {
                              if (val) {
                                selectedMuscles.add(muscle);
                              } else {
                                selectedMuscles.remove(muscle);
                              }
                            });
                          },
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primary,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        onPressed: () async {
                          final provider = Provider.of<ExerciseProvider>(context, listen: false);
                          Navigator.pop(ctx);
                          try {
                            await provider.logExercise(
                              exerciseName: nameController.text,
                              exerciseType: selectedType.toLowerCase(),
                              muscleGroups: selectedMuscles.toList(),
                              durationMinutes: int.tryParse(durationController.text) ?? 30,
                            );
                            if (ctx.mounted) {
                              ScaffoldMessenger.of(ctx).showSnackBar(
                                const SnackBar(content: Text('Exercise logged!'), backgroundColor: AppTheme.primary),
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
                        child: const Text(
                          'Log Exercise',
                          style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
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
    final exerciseProvider = Provider.of<ExerciseProvider>(context);
    final user = authProvider.currentUser;
    final logs = exerciseProvider.todayLogs;

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
        title: const Row(
          children: [
            Icon(Icons.fitness_center, color: AppTheme.primary, size: 24),
            SizedBox(width: 6),
            Text(
              'Exercise',
              style: TextStyle(fontFamily: 'Outfit', fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Colors.white),
            onPressed: () => exerciseProvider.fetchTodayLogs(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => exerciseProvider.fetchTodayLogs(),
        color: AppTheme.primary,
        backgroundColor: AppTheme.cardBg,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Summary card
              Container(
                width: double.infinity,
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
                            'TODAY\'S ACTIVITY',
                            style: TextStyle(fontFamily: 'Inter', fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted, letterSpacing: 1.2),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${logs.length} exercises',
                            style: const TextStyle(fontFamily: 'Outfit', fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.orange.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.orange.withValues(alpha: 0.2)),
                      ),
                      child: Column(
                        children: [
                          Text(
                            '${exerciseProvider.totalCaloriesBurned}',
                            style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold, color: Colors.orange),
                          ),
                          const Text(
                            'kcal burned',
                            style: TextStyle(fontFamily: 'Inter', fontSize: 10, color: AppTheme.textSecondary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Exercise type quick add
              const Text(
                'Quick Add',
                style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  _buildQuickAddCard(Icons.directions_run, 'Cardio', Colors.orange, '30 min run'),
                  const SizedBox(width: 12),
                  _buildQuickAddCard(Icons.fitness_center, 'Strength', AppTheme.primary, '4 sets x 12 reps'),
                ],
              ),
              const SizedBox(height: 20),

              // Today's logs
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Today\'s Log',
                    style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  TextButton.icon(
                    icon: const Icon(Icons.add_circle_outline, color: AppTheme.primary, size: 18),
                    label: const Text('Add', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
                    onPressed: _showAddExerciseDialog,
                  ),
                ],
              ),
              const SizedBox(height: 12),

              if (exerciseProvider.isLoading && logs.isEmpty)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: CircularProgressIndicator(color: AppTheme.primary),
                  ),
                )
              else if (logs.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: AppTheme.cardBg,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.border),
                  ),
                  child: const Column(
                    children: [
                      Icon(Icons.fitness_center_outlined, size: 48, color: AppTheme.textMuted),
                      SizedBox(height: 12),
                      Text(
                        'No exercises logged yet',
                        style: TextStyle(fontFamily: 'Inter', color: AppTheme.textMuted, fontSize: 14),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Tap + to add your first exercise',
                        style: TextStyle(fontFamily: 'Inter', color: AppTheme.textSecondary, fontSize: 12),
                      ),
                    ],
                  ),
                )
              else
                ...logs.map((log) => Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: AppTheme.cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.border),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        leading: CircleAvatar(
                          backgroundColor: AppTheme.primary.withValues(alpha: 0.15),
                          child: const Icon(Icons.fitness_center, color: AppTheme.primary, size: 20),
                        ),
                        title: Text(
                          log.exerciseName,
                          style: const TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600, color: Colors.white, fontSize: 14),
                        ),
                        subtitle: Text(
                          '${log.durationMinutes} min • ${log.caloriesBurned} kcal',
                          style: const TextStyle(fontFamily: 'Inter', fontSize: 12, color: AppTheme.textSecondary),
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.remove_circle_outline, color: AppTheme.tertiary, size: 18),
                          onPressed: () => exerciseProvider.deleteLog(log.id),
                        ),
                      ),
                    )),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddExerciseDialog,
        backgroundColor: AppTheme.primary,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildQuickAddCard(IconData icon, String label, Color color, String subtitle) {
    return Expanded(
      child: GestureDetector(
        onTap: _showAddExerciseDialog,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.cardBg,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.border),
          ),
          child: Column(
            children: [
              Icon(icon, color: color, size: 28),
              const SizedBox(height: 8),
              Text(label, style: const TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold, color: Colors.white, fontSize: 13)),
              Text(subtitle, style: const TextStyle(fontFamily: 'Inter', fontSize: 10, color: AppTheme.textSecondary)),
            ],
          ),
        ),
      ),
    );
  }
}
