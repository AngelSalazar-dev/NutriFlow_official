"""
NutriFlow AI Agent - Main Automation Script

Este script automatiza:
- Generación de contenido (artículos SEO)
- Publicación en redes sociales
- Email marketing
- Optimización de ingresos
- Reportes automáticos

Requisitos:
- Python 3.9+
- pip install openai requests python-dotenv

Uso:
    python ai-agent.py
"""

import os
import json
import time
import requests
from datetime import datetime, timedelta
from typing import Optional
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración
BASE_URL = os.getenv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')
AI_AGENT_API_KEY = os.getenv('AI_AGENT_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
BUFFER_ACCESS_TOKEN = os.getenv('BUFFER_ACCESS_TOKEN')
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')

# Headers para API de NutriFlow
NUTRIFLOW_HEADERS = {
    'Authorization': f'Bearer {AI_AGENT_API_KEY}',
    'Content-Type': 'application/json'
}


class NutriFlowAIAgent:
    """Agente de IA principal para NutriFlow"""

    def __init__(self):
        self.api_key = AI_AGENT_API_KEY
        self.base_url = BASE_URL
        self.openai_key = OPENAI_API_KEY
        
    def generate_article(self, topic: str, keywords: list, word_count: int = 2000) -> dict:
        """
        Generar artículo SEO optimizado usando OpenAI
        
        Args:
            topic: Tema principal del artículo
            keywords: Lista de keywords para SEO
            word_count: Cantidad de palabras objetivo
            
        Returns:
            dict con title, content, excerpt, slug
        """
        if not self.openai_key:
            print("⚠️ OpenAI API key no configurada. Usando contenido placeholder.")
            return self._generate_placeholder_article(topic)
        
        prompt = f"""
Escribe un artículo completo sobre nutrición y salud para NutriFlow.

Tema: {topic}
Keywords: {', '.join(keywords)}
Extensión: {word_count} palabras

Requisitos:
- Título atractivo y optimizado para SEO
- Introducción que enganche
- 3-5 secciones principales con subtítulos
- Información basada en evidencia científica
- Llamado a la acción al final
- Tono cercano pero profesional
- Formato Markdown

El artículo debe ser útil para personas que quieren mejorar su salud,
perder peso, ganar músculo o mantener hábitos saludables.
"""
        
        try:
            response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {self.openai_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'gpt-4-turbo-preview',
                    'messages': [
                        {'role': 'system', 'content': 'Eres un nutricionista y escritor profesional especializado en salud y bienestar.'},
                        {'role': 'user', 'content': prompt}
                    ],
                    'max_tokens': word_count * 1.3,
                    'temperature': 0.7
                }
            )
            
            if response.status_code == 200:
                content = response.json()['choices'][0]['message']['content']
                
                # Extraer título (primera línea)
                lines = content.split('\n')
                title = lines[0].replace('#', '').strip() if lines else topic
                
                return {
                    'title': title,
                    'content': content,
                    'excerpt': content[:200] + '...',
                    'slug': self._generate_slug(title),
                    'category': 'nutrition',
                    'readTime': max(1, word_count // 200)
                }
            else:
                print(f"❌ Error OpenAI: {response.text}")
                return self._generate_placeholder_article(topic)
                
        except Exception as e:
            print(f"❌ Error generando artículo: {e}")
            return self._generate_placeholder_article(topic)
    
    def _generate_placeholder_article(self, topic: str) -> dict:
        """Generar artículo placeholder cuando no hay API de IA"""
        return {
            'title': f'Guía Completa sobre {topic}',
            'content': f"""
# {topic}

## Introducción

Este es un artículo placeholder sobre {topic}. 

Cuando configures tu API key de OpenAI, este contenido será generado automáticamente con IA.

## Beneficios

- Beneficio 1
- Beneficio 2
- Beneficio 3

## Conclusión

Para más información, consulta con un profesional de la salud.
""",
            'excerpt': f'Artículo sobre {topic}',
            'slug': self._generate_slug(topic),
            'category': 'nutrition',
            'readTime': 5
        }
    
    def _generate_slug(self, title: str) -> str:
        """Generar slug URL-friendly desde título"""
        slug = title.lower()
        slug = slug.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
        slug = ''.join(c if c.isalnum() or c == ' ' else '' for c in slug)
        slug = '-'.join(slug.split())
        return slug
    
    def publish_article(self, article: dict) -> bool:
        """
        Publicar artículo en NutriFlow
        
        Args:
            article: dict con title, content, excerpt, slug, category
            
        Returns:
            bool: True si se publicó exitosamente
        """
        try:
            response = requests.post(
                f'{self.base_url}/api/articles',
                headers=NUTRIFLOW_HEADERS,
                json=article
            )
            
            if response.status_code == 201:
                print(f"✅ Artículo publicado: {article['title']}")
                return True
            else:
                print(f"❌ Error publicando artículo: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    def post_to_social(self, content: str, platforms: list = ['twitter', 'linkedin']) -> dict:
        """
        Publicar contenido en redes sociales
        
        Args:
            content: Texto a publicar
            platforms: Lista de plataformas ['twitter', 'linkedin', 'facebook', 'instagram']
            
        Returns:
            dict con resultados por plataforma
        """
        results = {}
        
        if not BUFFER_ACCESS_TOKEN:
            print("⚠️ Buffer API token no configurado. Simulando publicación.")
            for platform in platforms:
                results[platform] = {'success': True, 'mock': True}
            return results
        
        try:
            # Buffer API
            response = requests.post(
                'https://api.bufferapp.com/1/updates/create.json',
                params={'access_token': BUFFER_ACCESS_TOKEN},
                data={
                    'text': content,
                    'profile_ids': platforms,
                    'now': True
                }
            )
            
            if response.status_code == 201:
                print(f"✅ Publicado en redes: {platforms}")
                for platform in platforms:
                    results[platform] = {'success': True}
            else:
                print(f"❌ Error en Buffer: {response.text}")
                for platform in platforms:
                    results[platform] = {'success': False, 'error': response.text}
                    
        except Exception as e:
            print(f"❌ Error publicando en redes: {e}")
            for platform in platforms:
                results[platform] = {'success': False, 'error': str(e)}
        
        return results
    
    def send_email_campaign(self, subject: str, content: str, recipients: list) -> dict:
        """
        Enviar campaña de email marketing
        
        Args:
            subject: Asunto del email
            content: Contenido del email (HTML)
            recipients: Lista de emails
            
        Returns:
            dict con resultados
        """
        if not SENDGRID_API_KEY:
            print("⚠️ SendGrid API key no configurada. Simulando envío.")
            return {
                'success': True,
                'sent': len(recipients),
                'mock': True
            }
        
        try:
            # SendGrid API
            response = requests.post(
                'https://api.sendgrid.com/v3/mail/send',
                headers={
                    'Authorization': f'Bearer {SENDGRID_API_KEY}',
                    'Content-Type': 'application/json'
                },
                json={
                    'personalizations': [{'to': [{'email': email} for email in recipients]}],
                    'from': {'email': 'noreply@nutriflow.app', 'name': 'NutriFlow'},
                    'subject': subject,
                    'content': [{'type': 'text/html', 'value': content}]
                }
            )
            
            if 200 <= response.status_code < 300:
                print(f"✅ Emails enviados: {len(recipients)}")
                return {'success': True, 'sent': len(recipients)}
            else:
                print(f"❌ Error SendGrid: {response.text}")
                return {'success': False, 'error': response.text}
                
        except Exception as e:
            print(f"❌ Error enviando emails: {e}")
            return {'success': False, 'error': str(e)}
    
    def record_revenue(self, amount: float, source: str, metadata: dict = None) -> dict:
        """
        Registrar ingreso generado por la IA
        
        Args:
            amount: Monto en USD
            source: 'subscription', 'adsense', 'affiliate', 'sponsorship', 'other'
            metadata: Información adicional
            
        Returns:
            dict con distribución de revenue
        """
        try:
            response = requests.post(
                f'{self.base_url}/api/ai/revenue/record',
                headers=NUTRIFLOW_HEADERS,
                json={
                    'amount': amount,
                    'source': source,
                    'metadata': metadata or {}
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Ingreso registrado: ${amount} → Owner: ${data['distribution']['ownerShare']:.2f}, AI: ${data['distribution']['aiOperatorShare']:.2f}")
                return data
            else:
                print(f"❌ Error registrando ingreso: {response.text}")
                return {'error': response.text}
                
        except Exception as e:
            print(f"❌ Error: {e}")
            return {'error': str(e)}
    
    def get_analytics(self, days: int = 30) -> dict:
        """
        Obtener analytics de revenue
        
        Args:
            days: Cantidad de días hacia atrás
            
        Returns:
            dict con analytics completas
        """
        try:
            response = requests.get(
                f'{self.base_url}/api/ai/revenue/analytics?days={days}',
                headers=NUTRIFLOW_HEADERS
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Error obteniendo analytics: {response.text}")
                return {}
                
        except Exception as e:
            print(f"❌ Error: {e}")
            return {}
    
    def generate_social_content(self, article_title: str, article_url: str) -> dict:
        """
        Generar contenido para redes sociales basado en artículo
        
        Args:
            article_title: Título del artículo
            article_url: URL del artículo
            
        Returns:
            dict con contenido por plataforma
        """
        return {
            'twitter': f"🌿 Nuevo artículo: {article_title}\n\nDescubre más sobre nutrición y salud.\n\n👉 {article_url}\n\n#Nutricion #Salud #NutriFlow",
            'linkedin': f"📊 {article_title}\n\nEn NutriFlow seguimos comprometidos con brindar información basada en ciencia para mejorar tu salud.\n\nLee el artículo completo: {article_url}\n\n#Nutrition #Health #Wellness",
            'facebook': f"🥗 ¿Quieres mejorar tu alimentación?\n\nAcabamos de publicar: {article_title}\n\nEntra y descubre consejos prácticos basados en ciencia.\n\n👉 {article_url}",
            'instagram': f"🌿 {article_title}\n\n💡 Tips basados en ciencia para mejorar tu salud\n\n👉 Link en bio\n\n#nutricion #salud #wellness #fitness #vidasaludable"
        }
    
    def run_daily_tasks(self):
        """
        Ejecutar tareas diarias automáticas con manejo de errores mejorado
        """
        print(f"\n{'='*60}")
        print(f"🤖 NutriFlow AI Agent - Tareas Diarias")
        print(f"{'='*60}\n")

        try:
            # 1. Generar y publicar artículo (1 cada día)
            print("📝 Generando artículo...")
            topics = [
                ('Alimentos para bajar de peso', ['perder peso', 'alimentos', 'calorías']),
                ('Cómo ganar músculo rápido', ['ganar músculo', 'proteínas', 'entrenamiento']),
                ('Mejores ejercicios para abdominales', ['abdominales', 'ejercicios', 'core']),
                ('Suplementos que sí funcionan', ['suplementos', 'proteína', 'creatina']),
                ('Cómo mantener hábitos saludables', ['hábitos', 'rutina', 'salud']),
            ]

            topic, keywords = topics[datetime.now().day % len(topics)]
            article = self.generate_article(topic, keywords)

            if article:
                self.publish_article(article)

                # 2. Publicar en redes sociales
                print("\n📱 Publicando en redes sociales...")
                social_content = self.generate_social_content(
                    article['title'],
                    f"{self.base_url}/articles/{article['slug']}"
                )

                for platform, content in social_content.items():
                    try:
                        self.post_to_social(content, [platform])
                        time.sleep(1)  # Rate limiting
                    except Exception as e:
                        print(f"⚠️ Error publicando en {platform}: {e}")
                        continue

            # 3. Registrar revenue de AdSense (simulado)
            print("\n💰 Registrando ingresos...")
            # En producción, esto vendría de la API de AdSense
            adsense_revenue = 0.50  # Ejemplo: $0.50/día
            try:
                self.record_revenue(adsense_revenue, 'adsense', {'date': str(datetime.now())})
            except Exception as e:
                print(f"⚠️ Error registrando revenue: {e}")

            # 4. Obtener y mostrar analytics
            print("\n📊 Obteniendo analytics...")
            try:
                analytics = self.get_analytics(days=7)

                if analytics and 'analytics' in analytics:
                    data = analytics['analytics']
                    print(f"\n💵 Revenue (últimos 7 días):")
                    print(f"   Total: ${data.get('totalRevenue', 0):.2f}")
                    print(f"   Owner (70%): ${data.get('ownerTotal', 0):.2f}")
                    print(f"   AI Operator (10%): ${data.get('aiOperatorTotal', 0):.2f}")
                    print(f"   Reinversión (20%): ${data.get('reinvestmentTotal', 0):.2f}")
            except Exception as e:
                print(f"⚠️ Error obteniendo analytics: {e}")

            print(f"\n{'='*60}")
            print("✅ Tareas diarias completadas")
            print(f"{'='*60}\n")

        except Exception as e:
            print(f"\n❌ Error crítico en tareas diarias: {e}")
            print("📝 Revisa la configuración y los logs para más detalles.")


def main():
    """Función principal"""
    agent = NutriFlowAIAgent()
    
    # Verificar configuración
    if not AI_AGENT_API_KEY:
        print("❌ AI_AGENT_API_KEY no configurada en .env")
        print("   Genera una clave: openssl rand -hex 32")
        print("   Agrega a .env.local: AI_AGENT_API_KEY=tu_clave")
        return
    
    print("🚀 NutriFlow AI Agent iniciado")
    print(f"   Base URL: {BASE_URL}")
    print(f"   OpenAI: {'✅' if OPENAI_API_KEY else '⚠️ No configurado'}")
    print(f"   Buffer: {'✅' if BUFFER_ACCESS_TOKEN else '⚠️ No configurado'}")
    print(f"   SendGrid: {'✅' if SENDGRID_API_KEY else '⚠️ No configurado'}")
    
    # Ejecutar tareas diarias
    agent.run_daily_tasks()
    
    # Programar próxima ejecución (en producción usar cron o scheduler)
    print("\n⏰ Próxima ejecución: mañana a la misma hora")
    print("   (En producción, configura un cron job o usa: python ai-agent.py --schedule)")


if __name__ == '__main__':
    main()
