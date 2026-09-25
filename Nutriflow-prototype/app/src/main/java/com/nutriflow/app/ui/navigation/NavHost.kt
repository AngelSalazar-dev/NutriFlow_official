package com.nutriflow.app.ui.navigation

import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.nutriflow.app.ui.screens.dashboard.DashboardScreen
import com.nutriflow.app.ui.screens.auth.LoginScreen
import com.nutriflow.app.ui.screens.auth.RegisterScreen
import com.nutriflow.app.ui.screens.onboarding.OnboardingScreen

/**
 * Navegación principal de NutriFlow
 */
@Composable
fun NutriFlowNavHost(
    navController: NavHostController,
    modifier: Modifier = Modifier
) {
    var startDestination by remember { mutableStateOf(Screen.Onboarding.route) }
    
    // Check if user has seen onboarding
    LaunchedEffect(Unit) {
        // TODO: Check from DataStore
        startDestination = Screen.Login.route
    }
    
    NavHost(
        navController = navController,
        startDestination = startDestination,
        modifier = modifier
    ) {
        // Onboarding
        composable(Screen.Onboarding.route) {
            OnboardingScreen(
                onFinished = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Onboarding.route) { inclusive = true }
                    }
                }
            )
        }
        
        // Login
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(Screen.Register.route)
                }
            )
        }
        
        // Register
        composable(Screen.Register.route) {
            RegisterScreen(
                onRegisterSuccess = {
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onNavigateToLogin = {
                    navController.popBackStack()
                }
            )
        }
        
        // Dashboard (Main App)
        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onNavigateToFood = { /* TODO */ },
                onNavigateToExercise = { /* TODO */ },
                onNavigateToProfile = { /* TODO */ }
            )
        }
    }
}
