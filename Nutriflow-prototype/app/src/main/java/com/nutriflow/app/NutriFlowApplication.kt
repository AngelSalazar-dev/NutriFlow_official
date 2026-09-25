package com.nutriflow.app

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

/**
 * Aplicación principal de NutriFlow
 * Configura Hilt para inyección de dependencias
 */
@HiltAndroidApp
class NutriFlowApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Inicialización de componentes globales
    }
}
