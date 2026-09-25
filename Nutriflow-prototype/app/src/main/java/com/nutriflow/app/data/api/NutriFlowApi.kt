package com.nutriflow.app.data.api

import com.nutriflow.app.data.model.*
import retrofit2.Response
import retrofit2.http.*

/**
 * Interfaz de API para NutriFlow
 * Define todos los endpoints disponibles
 */
interface NutriFlowApi {
    
    // ==================== AUTH ====================
    
    /**
     * Iniciar sesión
     * POST /api/auth/login
     */
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
    
    /**
     * Registrarse
     * POST /api/auth/register
     */
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
    
    /**
     * Obtener perfil del usuario
     * GET /api/auth/profile
     */
    @GET("auth/profile")
    suspend fun getProfile(@Header("Authorization") token: String): Response<AuthResponse>
    
    /**
     * Actualizar perfil
     * PUT /api/auth/profile
     */
    @PUT("auth/profile")
    suspend fun updateProfile(
        @Header("Authorization") token: String,
        @Body profile: Map<String, Any>
    ): Response<AuthResponse>
    
    // ==================== FOOD ====================
    
    /**
     * Obtener alimentos de hoy
     * GET /api/food/today
     */
    @GET("food/today")
    suspend fun getTodayFood(@Header("Authorization") token: String): Response<List<FoodLog>>
    
    /**
     * Agregar alimento
     * POST /api/food/log
     */
    @POST("food/log")
    suspend fun addFoodLog(
        @Header("Authorization") token: String,
        @Body foodLog: FoodLog
    ): Response<FoodLog>
    
    /**
     * Eliminar alimento
     * DELETE /api/food/log?id={id}
     */
    @DELETE("food/log")
    suspend fun deleteFoodLog(
        @Header("Authorization") token: String,
        @Query("id") id: String
    ): Response<Unit>
    
    // ==================== EXERCISE ====================
    
    /**
     * Obtener ejercicios de hoy
     * GET /api/exercise/log?date={date}
     */
    @GET("exercise/log")
    suspend fun getExerciseLogs(
        @Header("Authorization") token: String,
        @Query("date") date: String
    ): Response<List<ExerciseLog>>
    
    /**
     * Agregar ejercicio
     * POST /api/exercise/log
     */
    @POST("exercise/log")
    suspend fun addExerciseLog(
        @Header("Authorization") token: String,
        @Body exerciseLog: ExerciseLog
    ): Response<ExerciseLog>
    
    /**
     * Eliminar ejercicio
     * DELETE /api/exercise/log?id={id}
     */
    @DELETE("exercise/log")
    suspend fun deleteExerciseLog(
        @Header("Authorization") token: String,
        @Query("id") id: String
    ): Response<Unit>
    
    // ==================== STATS ====================
    
    /**
     * Obtener estadísticas de hoy
     * GET /api/stats/today
     */
    @GET("stats/today")
    suspend fun getTodayStats(@Header("Authorization") token: String): Response<StatsResponse>
    
    /**
     * Obtener historial de estadísticas
     * GET /api/stats/history?days={days}
     */
    @GET("stats/history")
    suspend fun getStatsHistory(
        @Header("Authorization") token: String,
        @Query("days") days: Int = 7
    ): Response<List<DailyStats>>
    
    // ==================== HYDRATION ====================
    
    /**
     * Agregar agua
     * POST /api/hydration
     */
    @POST("hydration")
    suspend fun addWater(
        @Header("Authorization") token: String,
        @Body waterData: Map<String, Int>
    ): Response<Unit>
}
