package com.nutriflow.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Light Theme Colors
private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF059669),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFD1FAE5),
    onPrimaryContainer = Color(0xFF064E3B),
    secondary = Color(0xFF57534E),
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFF5F5F4),
    onSecondaryContainer = Color(0xFF292524),
    tertiary = Color(0xFF34D399),
    onTertiary = Color.White,
    background = Color(0xFFFAFAF9),
    onBackground = Color(0xFF1C1917),
    surface = Color.White,
    onSurface = Color(0xFF1C1917),
    surfaceVariant = Color(0xFFE7E5E4),
    onSurfaceVariant = Color(0xFF44403C),
    error = Color(0xFFEF4444),
    onError = Color.White,
)

// Dark Theme Colors
private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF10B981),
    onPrimary = Color.White,
    primaryContainer = Color(0xFF065F46),
    onPrimaryContainer = Color(0xFFD1FAE5),
    secondary = Color(0xFFA8A29E),
    onSecondary = Color(0xFF292524),
    secondaryContainer = Color(0xFF44403C),
    onSecondaryContainer = Color(0xFFF5F5F4),
    tertiary = Color(0xFF34D399),
    onTertiary = Color.White,
    background = Color(0xFF1C1917),
    onBackground = Color(0xFFFAFAF9),
    surface = Color(0xFF292524),
    onSurface = Color(0xFFFAFAF9),
    surfaceVariant = Color(0xFF44403C),
    onSurfaceVariant = Color(0xFFE7E5E4),
    error = Color(0xFFEF4444),
    onError = Color.White,
)

@Composable
fun NutriFlowTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
