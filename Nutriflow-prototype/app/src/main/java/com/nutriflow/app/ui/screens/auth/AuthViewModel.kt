package com.nutriflow.app.ui.screens.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nutriflow.app.data.model.AuthResponse
import com.nutriflow.app.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.Response
import javax.inject.Inject

/**
 * ViewModel para autenticación
 */
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()
    
    /**
     * Iniciar sesión
     */
    fun login(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            try {
                val response = authRepository.login(email, password)
                
                if (response.isSuccessful && response.body() != null) {
                    val authResponse = response.body()!!
                    
                    // Guardar token si existe
                    authResponse.token?.let { token ->
                        authRepository.saveToken(token)
                    }
                    
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        isLoggedIn = true,
                        user = authResponse.user
                    )
                } else {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = "Email o contraseña incorrectos"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = "Error de conexión. Inténtalo de nuevo."
                )
            }
        }
    }
    
    /**
     * Registrarse
     */
    fun register(name: String, email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            try {
                val response = authRepository.register(name, email, password)
                
                if (response.isSuccessful && response.body() != null) {
                    val authResponse = response.body()!!
                    
                    // Guardar token si existe
                    authResponse.token?.let { token ->
                        authRepository.saveToken(token)
                    }
                    
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        isLoggedIn = true,
                        user = authResponse.user
                    )
                } else {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = "Error al registrar. Verifica los datos."
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = "Error de conexión. Inténtalo de nuevo."
                )
            }
        }
    }
    
    /**
     * Cerrar sesión
     */
    fun logout() {
        viewModelScope.launch {
            authRepository.clearToken()
            _uiState.value = AuthUiState()
        }
    }
}

/**
 * Estado de la UI para autenticación
 */
data class AuthUiState(
    val isLoading: Boolean = false,
    val isLoggedIn: Boolean = false,
    val user: com.nutriflow.app.data.model.User? = null,
    val error: String? = null
)
