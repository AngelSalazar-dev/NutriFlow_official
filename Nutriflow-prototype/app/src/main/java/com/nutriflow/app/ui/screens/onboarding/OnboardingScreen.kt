package com.nutriflow.app.ui.screens.onboarding

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

/**
 * Pantalla de Onboarding
 */
@Composable
fun OnboardingScreen(
    onFinished: () -> Unit
) {
    val pagerState = rememberPagerState(pageCount = { 3 })
    val scope = rememberCoroutineScope()
    
    val pages = listOf(
        OnboardingPage(
            title = "Controla tu alimentación",
            description = "Registra tus comidas y obtén recomendaciones personalizadas con IA",
            icon = "🥗"
        ),
        OnboardingPage(
            title = "Sigue tu progreso",
            description = "Visualiza tu evolución con estadísticas detalladas y gráficos",
            icon = "📊"
        ),
        OnboardingPage(
            title = "Alcanza tus metas",
            description = "La IA te ayudará a lograr tus objetivos de salud de forma inteligente",
            icon = "🎯"
        )
    )
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Spacer(modifier = Modifier.height(48.dp))
        
        // Icon
        Text(
            text = pages[pagerState.currentPage].icon,
            style = MaterialTheme.typography.displayLarge
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // Content
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = pages[pagerState.currentPage].title,
                style = MaterialTheme.typography.headlineMedium,
                color = MaterialTheme.colorScheme.onBackground,
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = pages[pagerState.currentPage].description,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 32.dp)
            )
        }
        
        // Page indicators
        Row(
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier.padding(16.dp)
        ) {
            repeat(3) { index ->
                Box(
                    modifier = Modifier
                        .padding(4.dp)
                        .size(if (pagerState.currentPage == index) 12.dp else 8.dp)
                        .let {
                            if (pagerState.currentPage == index) {
                                it
                            } else {
                                it
                            }
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Surface(
                        modifier = Modifier.size(if (pagerState.currentPage == index) 12.dp else 8.dp),
                        shape = CircleShape,
                        color = if (pagerState.currentPage == index) {
                            MaterialTheme.colorScheme.primary
                        } else {
                            MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.3f)
                        }
                    ) {}
                }
            }
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // Buttons
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            if (pagerState.currentPage < 2) {
                TextButton(onClick = {
                    scope.launch {
                        pagerState.animateScrollToPage(2)
                    }
                }) {
                    Text("Saltar")
                }
                
                Button(onClick = {
                    scope.launch {
                        pagerState.animateScrollToPage(pagerState.currentPage + 1)
                    }
                }) {
                    Text("Siguiente")
                }
            } else {
                Button(
                    onClick = onFinished,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Comenzar")
                }
            }
        }
        
        Spacer(modifier = Modifier.height(48.dp))
    }
}

data class OnboardingPage(
    val title: String,
    val description: String,
    val icon: String
)
