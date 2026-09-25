package com.nutriflow.app.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.stringPreferencesKey
import com.nutriflow.app.data.api.NutriFlowApi
import com.nutriflow.app.data.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import retrofit2.Response
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repositorio de Autenticación
 * Maneja el estado de sesión del usuario
 */
@Singleton
class AuthRepository @Inject constructor(
    private val api: NutriFlowApi,
    private val dataStore: DataStore<Preferences>
) {
    companion object {
        val TOKEN_KEY = stringPreferencesKey("auth_token")
        val USER_KEY = stringPreferencesKey("user_data")
    }
    
    /**
     * Flujo del token de autenticación
     */
    val authToken: Flow<String?> = dataStore.data
        .catch { exception ->
            if (exception is IOException) emit(emptyPreferences())
            else throw exception
        }
        .map { preferences ->
            preferences[TOKEN_KEY]
        }
    
    /**
     * Iniciar sesión
     */
    suspend fun login(email: String, password: String): Response<AuthResponse> {
        return api.login(LoginRequest(email, password))
    }
    
    /**
     * Registrarse
     */
    suspend fun register(name: String, email: String, password: String): Response<AuthResponse> {
        return api.register(RegisterRequest(email, password, name))
    }
    
    /**
     * Guardar token
     */
    suspend fun saveToken(token: String) {
        dataStore.edit { preferences ->
            preferences[TOKEN_KEY] = token
        }
    }
    
    /**
     * Eliminar token (logout)
     */
    suspend fun clearToken() {
        dataStore.edit { preferences ->
            preferences.remove(TOKEN_KEY)
            preferences.remove(USER_KEY)
        }
    }
    
    /**
     * Obtener token actual
     */
    suspend fun getToken(): String? {
        return dataStore.data.map { it[TOKEN_KEY] }.firstOrNull()
    }
    
    /**
     * Obtener headers de autorización
     */
    suspend fun getAuthHeaders(): Map<String, String> {
        val token = getToken()
        return if (token != null) {
            mapOf("Authorization" to "Bearer $token")
        } else {
            emptyMap()
        }
    }
}

/**
 * Repositorio de Alimentos
 */
@Singleton
class FoodRepository @Inject constructor(
    private val api: NutriFlowApi,
    private val dataStore: DataStore<Preferences>
) {
    private suspend fun getAuthHeaders(): Map<String, String> {
        val token = dataStore.data.map { it[AuthRepository.TOKEN_KEY] }.firstOrNull()
        return if (token != null) {
            mapOf("Authorization" to "Bearer $token")
        } else {
            emptyMap()
        }
    }
    
    suspend fun getTodayFood(): Response<List<FoodLog>> {
        return try {
            api.getTodayFood(getAuthHeaders().getValue("Authorization"))
        } catch (e: Exception) {
            Response.error(500, okhttp3.ResponseBody.create(null, ""))
        }
    }
    
    suspend fun addFoodLog(foodLog: FoodLog): Response<FoodLog> {
        return api.addFoodLog(getAuthHeaders().getValue("Authorization"), foodLog)
    }
    
    suspend fun deleteFoodLog(id: String): Response<Unit> {
        return api.deleteFoodLog(getAuthHeaders().getValue("Authorization"), id)
    }
}

/**
 * Repositorio de Ejercicios
 */
@Singleton
class ExerciseRepository @Inject constructor(
    private val api: NutriFlowApi,
    private val dataStore: DataStore<Preferences>
) {
    private suspend fun getAuthHeaders(): Map<String, String> {
        val token = dataStore.data.map { it[AuthRepository.TOKEN_KEY] }.firstOrNull()
        return if (token != null) {
            mapOf("Authorization" to "Bearer $token")
        } else {
            emptyMap()
        }
    }
    
    suspend fun getExerciseLogs(date: String): Response<List<ExerciseLog>> {
        return api.getExerciseLogs(getAuthHeaders().getValue("Authorization"), date)
    }
    
    suspend fun addExerciseLog(exerciseLog: ExerciseLog): Response<ExerciseLog> {
        return api.addExerciseLog(getAuthHeaders().getValue("Authorization"), exerciseLog)
    }
    
    suspend fun deleteExerciseLog(id: String): Response<Unit> {
        return api.deleteExerciseLog(getAuthHeaders().getValue("Authorization"), id)
    }
}
