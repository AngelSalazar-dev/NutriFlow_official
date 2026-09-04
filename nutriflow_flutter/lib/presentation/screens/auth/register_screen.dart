import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../providers/auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _ageController = TextEditingController();
  final _weightController = TextEditingController();
  final _heightController = TextEditingController();
  final _referralCodeController = TextEditingController();

  String _selectedSex = 'male';
  String _selectedActivityLevel = 'moderate';
  String _selectedGoal = 'maintain';

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.register(
      email: _emailController.text.trim(),
      password: _passwordController.text,
      confirmPassword: _confirmPasswordController.text,
      name: _nameController.text.trim(),
      age: int.tryParse(_ageController.text) ?? 25,
      sex: _selectedSex,
      weight: double.tryParse(_weightController.text) ?? 70.0,
      height: double.tryParse(_heightController.text) ?? 170.0,
      activityLevel: _selectedActivityLevel,
      goal: _selectedGoal,
      referralCode: _referralCodeController.text.trim(),
    );

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Cuenta creada con éxito. ¡Bienvenido!'),
          backgroundColor: AppTheme.primary,
        ),
      );
      Navigator.pop(context); // Go back to login screen which will redirect to home due to auth state
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(authProvider.errorMessage ?? 'Error al registrarse'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Registro',
          style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Comienza tu cambio hoy',
                  style: TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Ingresa tus detalles para crear tu perfil de salud personalizado.',
                  style: TextStyle(fontFamily: 'Inter', color: Color(0xFF94A3B8), fontSize: 15),
                ),
                const SizedBox(height: 36),

                // Name
                TextFormField(
                  controller: _nameController,
                  style: const TextStyle(color: Colors.white, fontFamily: 'Inter'),
                  decoration: _inputDecoration('Nombre completo', Icons.person_outline),
                  validator: (val) => val == null || val.isEmpty ? 'Por favor ingresa tu nombre' : null,
                ),
                const SizedBox(height: 20),

                // Email
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  style: const TextStyle(color: Colors.white, fontFamily: 'Inter'),
                  decoration: _inputDecoration('Correo electrónico', Icons.email_outlined),
                  validator: (val) {
                    if (val == null || val.trim().isEmpty) return 'Por favor ingresa tu correo';
                    if (!val.contains('@')) return 'Ingresa un correo electrónico válido';
                    return null;
                  },
                ),
                const SizedBox(height: 20),

                // Password
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  style: const TextStyle(color: Colors.white, fontFamily: 'Inter'),
                  decoration: _inputDecoration('Contraseña', Icons.lock_outline),
                  validator: (val) => val == null || val.length < 8 ? 'La contraseña debe tener al menos 8 caracteres' : null,
                ),
                const SizedBox(height: 20),

                // Confirm Password
                TextFormField(
                  controller: _confirmPasswordController,
                  obscureText: true,
                  style: const TextStyle(color: Colors.white, fontFamily: 'Inter'),
                  decoration: _inputDecoration('Confirmar contraseña', Icons.lock_outline),
                  validator: (val) {
                    if (val != _passwordController.text) return 'Las contraseñas no coinciden';
                    return null;
                  },
                ),
                const SizedBox(height: 20),

                // Row for Age, Weight, Height
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _ageController,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(color: Colors.white, fontFamily: 'Inter'),
                        decoration: _inputDecoration('Edad', Icons.calendar_today_outlined),
                        validator: (val) => val == null || val.isEmpty ? 'Requerido' : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _weightController,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(color: Colors.white, fontFamily: 'Inter'),
                        decoration: _inputDecoration('Peso (kg)', Icons.scale_outlined),
                        validator: (val) => val == null || val.isEmpty ? 'Requerido' : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _heightController,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(color: Colors.white, fontFamily: 'Inter'),
                        decoration: _inputDecoration('Altura (cm)', Icons.height),
                        validator: (val) => val == null || val.isEmpty ? 'Requerido' : null,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Sex Selection
                const Text(
                  'Género',
                  style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _sexOption('Masculino', 'male'),
                    const SizedBox(width: 16),
                    _sexOption('Femenino', 'female'),
                  ],
                ),
                const SizedBox(height: 24),

                // Goal Selection
                const Text(
                  'Objetivo Nutricional',
                  style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16),
                ),
                const SizedBox(height: 8),
                _dropdownOption<String>(
                  value: _selectedGoal,
                  items: const [
                    DropdownMenuItem(value: 'lose', child: Text('Perder peso')),
                    DropdownMenuItem(value: 'maintain', child: Text('Mantener peso')),
                    DropdownMenuItem(value: 'gain', child: Text('Aumentar masa muscular')),
                  ],
                  onChanged: (val) => setState(() => _selectedGoal = val!),
                ),
                const SizedBox(height: 24),

                // Activity Level Selection
                const Text(
                  'Nivel de Actividad',
                  style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16),
                ),
                const SizedBox(height: 8),
                _dropdownOption<String>(
                  value: _selectedActivityLevel,
                  items: const [
                    DropdownMenuItem(value: 'sedentary', child: Text('Sedentario (Poco ejercicio)')),
                    DropdownMenuItem(value: 'light', child: Text('Ligero (1-3 días/semana)')),
                    DropdownMenuItem(value: 'moderate', child: Text('Moderado (3-5 días/semana)')),
                    DropdownMenuItem(value: 'active', child: Text('Activo (6-7 días/semana)')),
                  ],
                  onChanged: (val) => setState(() => _selectedActivityLevel = val!),
                ),
                const SizedBox(height: 24),

                // Referral code
                TextFormField(
                  controller: _referralCodeController,
                  style: const TextStyle(color: Colors.white, fontFamily: 'Inter'),
                  decoration: _inputDecoration('Código de referido (opcional)', Icons.card_giftcard),
                ),
                const SizedBox(height: 36),

                // Register Button
                ElevatedButton(
                  onPressed: authProvider.isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: authProvider.isLoading
                      ? const SizedBox(
                          height: 24,
                          width: 24,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text(
                          'Crear mi Cuenta',
                          style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: AppTheme.textMuted, fontFamily: 'Inter'),
      prefixIcon: Icon(icon, color: AppTheme.primary),
      filled: true,
      fillColor: AppTheme.cardBg,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: AppTheme.primary, width: 1.5),
      ),
    );
  }

  Widget _sexOption(String label, String val) {
    final isSelected = _selectedSex == val;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedSex = val),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.primary : AppTheme.cardBg,
            borderRadius: BorderRadius.circular(12),
            border: isSelected ? Border.all(color: AppTheme.primary, width: 1.5) : null,
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              fontFamily: 'Inter',
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : AppTheme.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  Widget _dropdownOption<T>({
    required T value,
    required List<DropdownMenuItem<T>> items,
    required ValueChanged<T?> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppTheme.cardBg,
        borderRadius: BorderRadius.circular(16),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<T>(
          value: value,
          dropdownColor: AppTheme.cardBg,
          style: const TextStyle(color: Colors.white, fontFamily: 'Inter', fontSize: 15),
          icon: const Icon(Icons.arrow_drop_down, color: AppTheme.primary),
          isExpanded: true,
          items: items,
          onChanged: onChanged,
        ),
      ),
    );
  }
}
