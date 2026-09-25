package com.nutriflow.app.data.model

import com.google.gson.annotations.SerializedName

/**
 * Modelo de usuario para la API de NutriFlow
 */
data class User(
    @SerializedName("_id") val id: String,
    @SerializedName("email") val email: String,
    @SerializedName("name") val name: String,
    @SerializedName("age") val age: Int? = null,
    @SerializedName("weight") val weight: Double? = null,
    @SerializedName("height") val height: Double? = null,
    @SerializedName("sex") val sex: String? = null,
    @SerializedName("activityLevel") val activityLevel: String? = null,
    @SerializedName("goal") val goal: String? = null,
    @SerializedName("subscriptionPlan") val subscriptionPlan: String = "free",
    @SerializedName("calorieGoal") val calorieGoal: Int? = null,
    @SerializedName("proteinGoal") val proteinGoal: Double? = null,
    @SerializedName("carbGoal") val carbGoal: Double? = null,
    @SerializedName("fatGoal") val fatGoal: Double? = null,
    @SerializedName("bmr") val bmr: Double? = null,
    @SerializedName("tdee") val tdee: Double? = null,
    @SerializedName("createdAt") val createdAt: String? = null,
)

/**
 * Modelo para login
 */
data class LoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String
)

/**
 * Modelo para registro
 */
data class RegisterRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("name") val name: String
)

/**
 * Respuesta de autenticación
 */
data class AuthResponse(
    @SerializedName("user") val user: User,
    @SerializedName("token") val token: String? = null
)

/**
 * Modelo para registro de alimentos
 */
data class FoodLog(
    @SerializedName("id") val id: String? = null,
    @SerializedName("userId") val userId: String? = null,
    @SerializedName("foodName") val foodName: String,
    @SerializedName("calories") val calories: Double,
    @SerializedName("protein") val protein: Double? = null,
    @SerializedName("carbs") val carbs: Double? = null,
    @SerializedName("fat") val fat: Double? = null,
    @SerializedName("servingSize") val servingSize: Int? = null,
    @SerializedName("mealType") val mealType: String = "snack",
    @SerializedName("logDate") val logDate: String? = null,
    @SerializedName("createdAt") val createdAt: String? = null
)

/**
 * Modelo para registro de ejercicios
 */
data class ExerciseLog(
    @SerializedName("id") val id: String? = null,
    @SerializedName("userId") val userId: String? = null,
    @SerializedName("exerciseName") val exerciseName: String,
    @SerializedName("exerciseType") val exerciseType: String = "strength",
    @SerializedName("metValue") val metValue: Double,
    @SerializedName("durationMin") val durationMin: Int,
    @SerializedName("caloriesBurned") val caloriesBurned: Double,
    @SerializedName("notes") val notes: String? = null,
    @SerializedName("date") val date: String? = null
)

/**
 * Estadísticas diarias
 */
data class DailyStats(
    @SerializedName("caloriesConsumed") val caloriesConsumed: Double = 0.0,
    @SerializedName("caloriesBurned") val caloriesBurned: Double = 0.0,
    @SerializedName("protein") val protein: Double = 0.0,
    @SerializedName("carbs") val carbs: Double = 0.0,
    @SerializedName("fat") val fat: Double = 0.0,
    @SerializedName("waterMl") val waterMl: Int = 0
)

/**
 * Respuesta de estadísticas
 */
data class StatsResponse(
    @SerializedName("stats") val stats: DailyStats
)
