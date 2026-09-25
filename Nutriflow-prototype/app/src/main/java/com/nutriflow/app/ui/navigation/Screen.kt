package com.nutriflow.app.ui.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Onboarding : Screen("onboarding")
    object Login : Screen("login")
    object Register : Screen("register")
    object Dashboard : Screen("dashboard")
    object FoodLog : Screen("food_log")
    object ExerciseLog : Screen("exercise_log")
    object Profile : Screen("profile")
    object Settings : Screen("settings")
}
