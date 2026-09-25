package com.nutriflow.app.di

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import com.nutriflow.app.data.api.NutriFlowApi
import com.nutriflow.app.data.repository.AuthRepository
import com.nutriflow.app.data.repository.FoodRepository
import com.nutriflow.app.data.repository.ExerciseRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

// Context extension for DataStore
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "nutriflow_prefs")

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    /**
     * Proveedor de OkHttpClient
     */
    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
        
        return OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()
    }
    
    /**
     * Proveedor de Retrofit
     */
    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/api/") // Android emulator localhost
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    /**
     * Proveedor de NutriFlowApi
     */
    @Provides
    @Singleton
    fun provideNutriFlowApi(retrofit: Retrofit): NutriFlowApi {
        return retrofit.create(NutriFlowApi::class.java)
    }
    
    /**
     * Proveedor de AuthRepository
     */
    @Provides
    @Singleton
    fun provideAuthRepository(
        api: NutriFlowApi,
        @ApplicationContext context: Context
    ): AuthRepository {
        return AuthRepository(api, context.dataStore)
    }
    
    /**
     * Proveedor de FoodRepository
     */
    @Provides
    @Singleton
    fun provideFoodRepository(
        api: NutriFlowApi,
        @ApplicationContext context: Context
    ): FoodRepository {
        return FoodRepository(api, context.dataStore)
    }
    
    /**
     * Proveedor de ExerciseRepository
     */
    @Provides
    @Singleton
    fun provideExerciseRepository(
        api: NutriFlowApi,
        @ApplicationContext context: Context
    ): ExerciseRepository {
        return ExerciseRepository(api, context.dataStore)
    }
}
