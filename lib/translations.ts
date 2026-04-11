export type LangCode = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'zh' | 'ja' | 'ko' | 'ar' | 'hi' | 'ru';

export const LANGUAGES: { code: LangCode; label: string; flag: string; dir?: 'rtl' }[] = [
  { code: 'en', label: 'English',    flag: 'EN' },
  { code: 'es', label: 'Español',    flag: 'ES' },
  { code: 'fr', label: 'Français',   flag: 'FR' },
  { code: 'de', label: 'Deutsch',    flag: 'DE' },
  { code: 'pt', label: 'Português',  flag: 'PT' },
  { code: 'it', label: 'Italiano',   flag: 'IT' },
  { code: 'zh', label: '中文',        flag: 'ZH' },
  { code: 'ja', label: '日本語',      flag: 'JA' },
  { code: 'ko', label: '한국어',      flag: 'KO' },
  { code: 'ar', label: 'العربية',    flag: 'AR', dir: 'rtl' },
  { code: 'hi', label: 'हिन्दी',     flag: 'HI' },
  { code: 'ru', label: 'Русский',    flag: 'RU' },
];

type Translations = {
  // Nav labels
  nav_dashboard: string;
  nav_food: string;
  nav_exercise: string;
  nav_history: string;
  nav_articles: string;
  nav_chat: string;
  nav_profile: string;
  nav_subscription: string;
  nav_settings: string;
  nav_logout: string;
  // Auth
  auth_login: string;
  auth_register: string;
  auth_free_start: string;
  // Landing
  landing_features: string;
  landing_pricing: string;
  landing_testimonials: string;
  // Auth Extra
  auth_email: string;
  auth_password: string;
  auth_remember: string;
  auth_forgot: string;
  auth_no_account: string;
  auth_create_account: string;
  auth_already_account: string;
  auth_db_error: string;
  auth_db_error_desc: string;
  auth_too_many_attempts: string;
  auth_unlocked_at: string;
  auth_welcome_back: string;
  auth_login_subtitle: string;
  auth_register_subtitle: string;
  auth_loading: string;
  auth_health_rules: string;
  auth_health_rules_desc: string;
  auth_start_now: string;
  auth_steps: string;
  auth_step_of: string;
  auth_name: string;
  auth_age: string;
  auth_sex: string;
  auth_male: string;
  auth_female: string;
  auth_weight: string;
  auth_height: string;
  auth_activity_title: string;
  auth_goal_title: string;
  auth_activity_sedentary: string;
  auth_activity_sedentary_desc: string;
  auth_activity_light: string;
  auth_activity_light_desc: string;
  auth_activity_moderate: string;
  auth_activity_moderate_desc: string;
  auth_activity_active: string;
  auth_activity_active_desc: string;
  auth_activity_very_active: string;
  auth_activity_very_active_desc: string;
  auth_goal_lose: string;
  auth_goal_maintain: string;
  auth_goal_gain: string;
  auth_back: string;
  auth_continue: string;
  auth_terms_agree: string;
  auth_terms: string;
  auth_privacy: string;
  auth_creating: string;
  // Common
  common_loading: string;
  common_error: string;
  common_save: string;
  common_cancel: string;
  common_delete: string;
  common_confirm: string;
  common_search: string;
  common_add: string;
  common_edit: string;
  common_close: string;
  common_back: string;
  common_next: string;
  common_yes: string;
  common_no: string;
  common_premium: string;
  common_free: string;
  common_days: string;
  common_date: string;
  common_user: string;
  common_wait: string;
  comming_soon: string;
  all_items: string;
  food_nutrient_density: string;
  common_contact: string;
  // Dashboard
  dash_welcome: string;
  dash_today: string;
  dash_calories: string;
  dash_protein: string;
  dash_carbs: string;
  dash_fat: string;
  dash_water: string;
  dash_steps: string;
  dash_weekly: string;
  dash_avg: string;
  // Food
  food_log: string;
  food_search: string;
  food_add: string;
  food_breakfast: string;
  food_lunch: string;
  food_dinner: string;
  food_snack: string;
  food_kcal: string;
  // Exercise
  ex_log: string;
  ex_add: string;
  ex_duration: string;
  ex_calories_burned: string;
  ex_type: string;
  ex_date: string;
  // Chat
  chat_placeholder: string;
  chat_send: string;
  chat_limit: string;
  chat_wait: string;
  chat_clear: string;
  chat_conversations: string;
  chat_asistant_name: string;
  chat_error_message: string;
  chat_api_error: string;
  chat_suggest_1: string;
  chat_suggest_2: string;
  chat_suggest_3: string;
  chat_suggest_4: string;
  chat_suggest_5: string;
  chat_suggest_6: string;
  chat_limit_title: string;
  chat_limit_unlimited: string;
  chat_limit_warning: string;
  chat_welcome_title: string;
  chat_welcome_subtitle: string;
  chat_input_placeholder: string;
  // Subscription
  sub_title: string;
  sub_free: string;
  sub_premium: string;
  sub_pro: string;
  sub_month: string;
  sub_year: string;
  sub_get_premium: string;
  sub_current: string;
  sub_upgrade: string;
  sub_plan_free_name: string;
  sub_plan_premium_name: string;
  sub_plan_pro_name: string;
  sub_plan_free_desc: string;
  sub_plan_premium_desc: string;
  sub_plan_pro_desc: string;
  sub_upgrade_premium: string;
  sub_get_pro: string;
  sub_feature_chat_limit: string;
  sub_feature_chat_unlimited: string;
  sub_feature_expert_articles: string;
  sub_feature_all_premium: string;
  sub_feature_detailed_nutrition: string;
  sub_feature_wearables: string;
  sub_feature_no_ads: string;
  sub_feature_ai_training: string;
  sub_feature_history: string;
  sub_status_free: string;
  sub_current_plan: string;
  // Profile
  prof_title: string;
  prof_name: string;
  prof_email: string;
  prof_avatar: string;
  prof_save: string;
  prof_activity: string;
  prof_danger_zone: string;
  prof_logout_desc: string;
  profile_activity: string;
  profile_activity_active: string;
  profile_activity_light: string;
  profile_activity_moderate: string;
  profile_activity_sedentary: string;
  profile_activity_very_active: string;
  // Settings
  set_title: string;
  set_notifications: string;
  set_theme: string;
  set_language: string;
  set_dark: string;
  set_light: string;
  // Sidebar tagline
  // Sidebar tagline
  sidebar_tagline: string;
  // Dashboard extras
  dash_greet: string;
  dash_macros: string;
  dash_progress_msg: string;
  dash_activity_level: string;
  dash_weekly_subtitle: string;
  dash_macros_subtitle: string;
  dash_register_food: string;
  dash_action_dietary: string;
  dash_action_dietary_desc: string;
  dash_action_exercise: string;
  dash_action_exercise_desc: string;
  dash_action_analytics: string;
  dash_action_analytics_desc: string;
  dash_update_data: string;
  dash_no_weekly_data: string;
  dash_no_weekly_data_desc: string;
  dash_no_macro_data: string;
  // Food Log
  food_log_title: string;
  food_log_subtitle: string;
  food_daily_consumption: string;
  food_yesterday: string;
  food_tomorrow: string;
  food_search_placeholder: string;
  food_verified: string;
  food_serving_size: string;
  food_serving_pieces: string;
  food_serving_grams: string;
  food_register_success: string;
  food_register_error: string;
  food_delete_confirm: string;
  food_water_title: string;
  food_water_goal: string;
  food_water_history: string;
  food_water_add_success: string;
  food_bev_coffee: string;
  food_bev_tea: string;
  food_bev_juice: string;
  food_bev_milk: string;
  // Exercise
  ex_title: string;
  ex_subtitle: string;
  ex_type_cardio: string;
  ex_type_strength: string;
  ex_type_flexibility: string;
  ex_type_hiit: string;
  ex_muscle_chest: string;
  ex_muscle_back: string;
  ex_muscle_shoulders: string;
  ex_muscle_biceps: string;
  ex_muscle_triceps: string;
  ex_muscle_abs: string;
  ex_muscle_quads: string;
  ex_muscle_glutes: string;
  ex_muscle_calves: string;
  ex_exercise_squat: string;
  ex_exercise_bench: string;
  ex_exercise_deadlift: string;
  ex_exercise_press: string;
  ex_exercise_running: string;
  ex_exercise_walking: string;
  ex_add_success: string;
  // Subscription / PayPal
  sub_paypal_loading: string;
  sub_paypal_error: string;
  sub_paypal_verify: string;
  sub_feature_ai: string;
  sub_feature_unlimited_history: string;
  sub_feature_priority_support: string;
  sub_faq_title: string;
  sub_faq_q1: string;
  sub_faq_a1: string;
  sub_faq_q2: string;
  sub_faq_a2: string;
  sub_faq_q3: string;
  sub_faq_a3: string;
  sub_faq_q4: string;
  sub_faq_a4: string;
  sub_upgrade_confirm: string;
  sub_change_confirm: string;
  sub_upgrade_desc: string;
  sub_change_desc: string;
  sub_cancel_warning: string;
  sub_billing_upcoming: string;
  sub_billing_details: string;
  sub_billing_history: string;
  sub_status_active: string;
  sub_status_canceled: string;
  sub_period_end: string;
  sub_help_title: string;
  sub_help_desc: string;
  sub_help_cta: string;
  sub_cancel_plan: string;
  sub_cancel_scheduled: string;
  sub_access_until: string;
  sub_access_until_info: string;
  sub_change_plan: string;
  sub_free_options_title: string;
  sub_free_gift: string;
  sub_free_refferal: string;
  sub_free_student: string;
  sub_free_desc: string;
  // Settings
  set_notif_title: string;
  set_notif_push: string;
  set_notif_email: string;
  set_notif_weekly: string;
  set_app_title: string;
  set_app_mode: string;
  set_app_lang: string;
  set_priv_title: string;
  set_priv_share: string;
  set_priv_export: string;
  set_acc_delete: string;
  set_acc_delete_confirm: string;
  // Articles
  art_title: string;
  art_subtitle: string;
  art_read_min: string;
  art_verified: string;
  art_empty: string;
  art_read_more: string;
  art_with_ads: string;
  art_loading: string;
  art_article_not_found: string;
  art_link_copied: string;
  art_author: string;
  art_sources: string;
  sub_success_title: string;
  sub_success_subtitle: string;
  sub_success_message: string;
  sub_success_dashboard: string;
  sub_success_explore: string;
  sub_verify_payment: string;
  sub_verify_error: string;
  sub_verify_back: string;
  // Landing
  landing_hero_title: string;
  landing_hero_subtitle: string;
  landing_start_button: string;
  landing_feat_smart: string;
  landing_feat_smart_desc: string;
  landing_feat_premium: string;
  landing_feat_premium_desc: string;
  landing_feat_ai_coach: string;
  landing_feat_ai_coach_desc: string;
  landing_feat_analytics: string;
  landing_feat_analytics_desc: string;
  landing_feat_verified: string;
  landing_feat_verified_desc: string;
  landing_feat_science: string;
  landing_feat_science_desc: string;
  landing_prices_title: string;
  landing_prices_subtitle: string;
  landing_row_kcal: string;
  landing_row_water: string;
  landing_row_ai_limit: string;
  landing_row_history: string;
  landing_row_vision: string;
  landing_row_ads: string;
  landing_row_routines: string;
  landing_row_export: string;
  landing_footer_brand: string;
  landing_footer_product: string;
  landing_footer_company: string;
  landing_footer_legal: string;
  landing_testimonial_1: string;
  landing_testimonial_2: string;
  landing_testimonial_3: string;
  sub_feature_ai_training: string;
  landing_footer_made_with: string;
  landing_footer_for_wellness: string;
};

const t: Record<LangCode, Translations | Partial<Translations>> = {
  en: {
    nav_dashboard: 'Dashboard', nav_food: 'Foods', nav_exercise: 'Exercise',
    nav_history: 'History', nav_articles: 'Articles', nav_chat: 'AI Chat',
    nav_profile: 'Profile', nav_subscription: 'Subscription', nav_settings: 'Settings',
    nav_logout: 'Log out',
    auth_login: 'Log in', auth_register: 'Sign up', auth_free_start: 'Start free',
    auth_email: 'Email', auth_password: 'Password', auth_remember: 'Keep me logged in',
    auth_forgot: 'Forgot your password?', auth_no_account: "Don't have an account?",
    auth_create_account: 'Create a free account', auth_already_account: 'Already have an account?',
    auth_db_error: 'Connection Problem', auth_db_error_desc: 'Database connection check failed. Please check environment variables.',
    auth_too_many_attempts: 'Too many attempts. Try again later.', auth_unlocked_at: 'Unlocked at:',
    auth_welcome_back: 'Welcome back', auth_login_subtitle: 'Log in to continue your progress.',
    auth_register_subtitle: 'Join NutriFlow and start your transformation.',
    auth_loading: 'Logging in...', auth_health_rules: 'Your Health, Your Rules',
    auth_health_rules_desc: 'Unlock access to the most advanced AI-powered platform. Habits, metrics, and nutrition in perfect harmony.',
    auth_start_now: 'Start Now', auth_steps: 'Step', auth_step_of: 'of',
    auth_name: 'Full Name', auth_age: 'Age', auth_sex: 'Sex', auth_male: 'Male', auth_female: 'Female',
    auth_weight: 'Weight (kg)', auth_height: 'Height (cm)', auth_activity_title: 'Current activity level',
    auth_goal_title: 'Your goal',
    auth_activity_sedentary: 'Sedentary', auth_activity_sedentary_desc: 'Little or no exercise',
    auth_activity_light: 'Light', auth_activity_light_desc: 'Exercise 1-3 days/week',
    auth_activity_moderate: 'Moderate', auth_activity_moderate_desc: 'Exercise 3-5 days/week',
    auth_activity_active: 'Active', auth_activity_active_desc: 'Exercise 6-7 days/week',
    auth_activity_very_active: 'Very Active', auth_activity_very_active_desc: 'Intense exercise',
    auth_goal_lose: 'Lose weight', auth_goal_maintain: 'Maintain weight', auth_goal_gain: 'Gain muscle',
    auth_back: 'Back', auth_continue: 'Continue', auth_creating: 'Creating account...',
    auth_terms_agree: 'By registering, you agree to our', auth_terms: 'Terms', auth_privacy: 'Privacy Policy',
    landing_features: 'Features', landing_pricing: 'Pricing', landing_testimonials: 'Testimonials',
    common_loading: 'Loading…', common_error: 'Error', common_save: 'Save',
    common_cancel: 'Cancel', common_delete: 'Delete', common_confirm: 'Confirm',
    common_search: 'Search', common_add: 'Add', common_edit: 'Edit', common_close: 'Close',
    common_back: 'Back', common_next: 'Next', common_yes: 'Yes', common_no: 'No',
    common_premium: 'Premium', common_free: 'Free',
    common_date: 'Date', common_days: 'days',
    common_user: 'User', common_wait: 'Please wait',
    comming_soon: 'Coming Soon',
    food_nutrient_density: 'Nutrient Density',
    food_bev_coffee: 'Coffee', food_bev_juice: 'Juice', food_bev_milk: 'Milk', food_bev_tea: 'Tea',
    common_contact: 'Contact',
    dash_welcome: 'Welcome back', dash_today: 'Today', dash_calories: 'Calories',
    dash_protein: 'Protein', dash_carbs: 'Carbs', dash_fat: 'Fat', dash_water: 'Water',
    dash_steps: 'Steps', dash_weekly: 'Weekly progress',
    food_log: 'Food log', food_search: 'Search food…', food_add: 'Add food',
    food_breakfast: 'Breakfast', food_lunch: 'Lunch', food_dinner: 'Dinner',
    food_snack: 'Snack', food_kcal: 'kcal',
    ex_log: 'Exercise log', ex_add: 'Add exercise', ex_duration: 'Duration (min)',
    ex_calories_burned: 'Calories burned', ex_type: 'Type', ex_date: 'Date',
    chat_placeholder: 'Ask NutriFlow AI…', chat_send: 'Send', chat_limit: 'Message limit reached',
    chat_wait: 'Wait {h}h {m}m to continue', chat_clear: 'Clear history',
    chat_suggest_1: 'What should I eat to lose weight?',
    chat_suggest_2: 'Best exercises for building muscle',
    chat_suggest_3: 'Healthy meal plan for the week',
    chat_suggest_4: 'How much water should I drink?',
    chat_suggest_5: 'Pre-workout nutrition tips',
    chat_suggest_6: 'How to improve sleep quality',
    chat_conversations: 'Conversations',
    chat_asistant_name: 'NutriFlow AI',
    chat_error_message: 'Error processing your message',
    chat_api_error: 'AI service temporarily unavailable',
    chat_limit_title: 'Messages left',
    chat_limit_unlimited: 'Unlimited',
    chat_limit_warning: 'Daily message limit reached',
    chat_welcome_title: 'Your AI Nutrition Assistant',
    chat_welcome_subtitle: 'Ask me anything about nutrition, exercise, and healthy living',
    chat_input_placeholder: 'Ask me about nutrition, exercise, or healthy habits...',
    all_items: 'All items',
    sub_title: 'Choose your plan', sub_free: 'Free', sub_premium: 'Elite',
    sub_pro: 'Maximum', sub_month: '/month', sub_year: '/year',
    sub_get_premium: 'Get Elite', sub_current: 'Current plan', sub_upgrade: 'Upgrade',
    sub_plan_free_name: 'Essential',
    sub_plan_premium_name: 'Elite',
    sub_plan_pro_name: 'Maximum',
    sub_plan_free_desc: 'Ideal for starting your journey',
    sub_plan_premium_desc: 'For users committed to results',
    sub_plan_pro_desc: 'Complete power for high-performance athletes',
    sub_upgrade_premium: 'Join Elite',
    sub_get_pro: 'Get Maximum',
    sub_status_active: 'Active',
    sub_status_canceled: 'Canceled',
    sub_period_end: 'Ends on',
    sub_billing_upcoming: 'Next Payment',
    sub_billing_details: 'Billing Details',
    sub_billing_history: 'Payment History',
    sub_help_title: 'Need Help?',
    sub_help_desc: 'If you have issues with your subscription, contact support.',
    sub_help_cta: '24/7 Support',
    sub_cancel_plan: 'Cancel Subscription',
    sub_cancel_scheduled: 'Your subscription will be canceled at the end of the current period.',
    sub_access_until: 'Access until:',
    sub_access_until_info: 'You will continue to have access until the end of your current billing period.',
    sub_change_plan: 'Change Plan',
    sub_faq_title: 'Frequently Asked Questions',
    sub_faq_q1: 'Can I cancel?',
    sub_faq_a1: 'Yes, at any time from settings.',
    sub_faq_q2: 'Is it secure?',
    sub_faq_a2: 'We use PayPal with bank-level encryption.',
    sub_faq_q3: 'Are there refunds?',
    sub_faq_a3: '14-day guarantee on all plans.',
    sub_faq_q4: 'Can I change plans?',
    sub_faq_a4: 'Yes, you can upgrade or downgrade your plan at any time.',
    sub_upgrade_confirm: 'Upgrade Plan?',
    sub_change_confirm: 'Change Plan?',
    sub_upgrade_desc: 'Upgrading will give you access to all new features immediately.',
    sub_change_desc: 'Changing plans will cancel your current plan and activate the new one.',
    sub_cancel_warning: 'Your current plan will be canceled at the end of the billing period.',
    set_acc_delete: 'Delete Account',
    set_acc_delete_confirm: 'Are you sure you want to delete your account?',
    common_wait: 'Wait',
    set_notif_title: 'Notifications',
    set_notif_push: 'Push Notifications',
    set_notif_email: 'Email Notifications',
    set_notif_weekly: 'Weekly Reports',
    set_app_title: 'Customization',
    set_app_mode: 'Dark Mode',
    set_app_lang: 'Interface Language',
    set_priv_title: 'Privacy & Data',
    set_priv_share: 'Share Anonymous Data',
    set_priv_export: 'Export My Data (JSON)',
    prof_danger_zone: 'Account & Security',
    prof_logout_desc: 'You have been logged out successfully',
    art_title: 'Health Library',
    art_subtitle: 'Learn the secrets of modern nutrition with expert-verified articles.',
    art_with_ads: 'Ad-Supported Mode',
    art_verified: 'Verified',
    art_read_min: 'min read',
    art_read_more: 'Read Now',
    art_empty: 'No articles found',
    art_article_not_found: 'Article not found',
    art_link_copied: 'Link copied',
    art_author: 'Author',
    art_sources: 'Sources & References',
    sub_success_title: 'Payment Successful!',
    sub_success_subtitle: 'Your subscription has been activated',
    sub_success_message: 'Thank you for upgrading your plan. You now have access to all the features of your new plan.',
    sub_success_dashboard: 'Go to Dashboard',
    sub_success_explore: 'Explore Features',
    sub_verify_payment: 'Verifying your payment...',
    sub_verify_error: 'We could not verify your payment. Please contact support.',
    sub_verify_back: 'Back to subscriptions',
    sub_feature_chat_limit: '10 AI messages per day',
    sub_feature_chat_unlimited: 'Unlimited AI Chat',
    sub_feature_expert_articles: 'Expert Health Articles',
    sub_feature_all_premium: 'All Elite features included',
    sub_feature_detailed_nutrition: 'Detailed Macro Analysis',
    sub_feature_wearables: 'Wearable Integration',
    sub_feature_no_ads: 'Ad-free experience',
    sub_status_free: 'Free Plan',
    sub_current_plan: 'Current Plan',
    sub_free_desc: 'Start your wellness journey',
    sub_free_gift: 'Free Gift',
    sub_free_options_title: 'Free Options',
    sub_free_refferal: 'Referral',
    sub_free_student: 'Student',
    sub_feature_unlimited_history: 'Unlimited History',
    sub_feature_priority_support: 'Priority Support',
    profile_activity: 'Activity Level',
    profile_activity_active: 'Active',
    profile_activity_light: 'Light',
    profile_activity_moderate: 'Moderate',
    profile_activity_sedentary: 'Sedentary',
    profile_activity_very_active: 'Very Active',
    prof_title: 'Profile', prof_name: 'Full name', prof_email: 'Email',
    prof_avatar: 'Avatar', prof_save: 'Save changes',
    set_title: 'Settings', set_notifications: 'Notifications', set_theme: 'Theme',
    set_language: 'Language', set_dark: 'Dark', set_light: 'Light',
    sidebar_tagline: 'Your health, simplified',
    dash_greet: 'Hello',
    dash_macros: 'Macronutrients',
    dash_progress_msg: 'Your progress today is looking excellent. Keep it up.',
    dash_activity_level: 'Activity Level',
    dash_weekly_subtitle: 'Calories consumed vs burned (estimate)',
    dash_macros_subtitle: 'Breakdown of your current intake',
    dash_register_food: 'Register new food',
    dash_action_dietary: 'Dietary',
    dash_action_dietary_desc: 'Log your next meals and snacks',
    dash_action_exercise: 'Workout',
    dash_action_exercise_desc: 'Add your progress in the gym',
    dash_action_analytics: 'Advanced Analytics',
    dash_action_analytics_desc: 'Explore your history month by month',
    dash_update_data: 'Update data',
    dash_no_weekly_data: 'No data this week',
    dash_no_weekly_data_desc: 'Log foods and exercise to see your progress',
    dash_no_macro_data: 'No data yet — log your first meal',
    dash_avg: 'AVERAGE',
    food_log_title: 'Health Log',
    food_log_subtitle: 'Control of food and hydration',
    food_daily_consumption: 'Daily Consumption',
    food_yesterday: 'Yesterday',
    food_tomorrow: 'Tomorrow',
    food_search_placeholder: 'Tacos, Pizza, Chicken...',
    food_verified: 'Verified',
    food_serving_size: 'Serving Size',
    food_serving_pieces: 'By Pieces',
    food_serving_grams: 'By Grams',
    food_register_success: 'Food logged!',
    food_register_error: 'Error logging food',
    food_delete_confirm: 'Are you sure you want to delete this log?',
    food_water_title: 'Hydration',
    food_water_goal: 'Goal: 2.5L',
    food_water_history: 'Water History',
    food_water_add_success: 'Water logged!',
    ex_title: 'Exercise',
    ex_subtitle: 'Log your activity',
    ex_type_cardio: 'Cardio',
    ex_type_strength: 'Strength',
    ex_type_flexibility: 'Flexibility',
    ex_type_hiit: 'HIIT',
    ex_muscle_chest: 'Chest',
    ex_muscle_back: 'Back',
    ex_muscle_shoulders: 'Shoulders',
    ex_muscle_biceps: 'Biceps',
    ex_muscle_triceps: 'Triceps',
    ex_muscle_abs: 'Abs',
    ex_muscle_quads: 'Quads',
    ex_muscle_glutes: 'Glutes',
    ex_muscle_calves: 'Calves',
    ex_exercise_squat: 'Squat',
    ex_exercise_bench: 'Bench Press',
    ex_exercise_deadlift: 'Deadlift',
    ex_exercise_press: 'Military Press',
    ex_exercise_running: 'Running',
    ex_exercise_walking: 'Walking',
    ex_add_success: 'Exercise logged!',
    sub_paypal_loading: 'Connecting securely with PayPal...',
    sub_paypal_error: 'Connection error with PayPal',
    sub_paypal_verify: 'Verifying payment...',
    sub_feature_ai: 'Advanced AI Nutrologist',
    sub_feature_history: 'Unlimited history',
    sub_feature_ads: 'No ads',
    landing_hero_title: 'Master your nutrition',
    landing_hero_subtitle: 'The smartest way to track your health',
    landing_start_button: 'Start now',
    landing_feat_smart: 'Smart Logging',
    landing_feat_smart_desc: 'Track your diet with AI that recognizes foods automatically.',
    landing_feat_premium: 'Premium Training',
    landing_feat_premium_desc: 'Personalized routines with automatic calorie calculations.',
    landing_feat_ai_coach: '24/7 AI Coach',
    landing_feat_ai_coach_desc: 'Your personal nutrition assistant, always available.',
    landing_feat_analytics: 'Advanced Analytics',
    landing_feat_analytics_desc: 'Visualize your progress with detailed charts and trends.',
    landing_feat_verified: 'Verified Info',
    landing_feat_verified_desc: 'Content reviewed by certified professionals.',
    landing_feat_science: 'Precise Science',
    landing_feat_science_desc: 'Validated formulas like Mifflin-St Jeor for accuracy.',
    landing_prices_title: 'Performance without compromises',
    landing_prices_subtitle: 'Choose the plan that powers your goals.',
    landing_row_kcal: 'Calorie Tracking',
    landing_row_water: 'Water Analysis',
    landing_row_ai_limit: 'AI Coach Limit',
    landing_row_history: 'Progress History',
    landing_row_vision: 'AI Vision Recognition',
    landing_row_ads: 'No Ads',
    landing_row_routines: 'AI Routines',
    landing_row_export: 'Data Export (PDF)',
    landing_footer_brand: 'Your smart companion for a healthier life.',
    landing_footer_product: 'Product',
    landing_footer_company: 'Company',
    landing_footer_legal: 'Legal',
    landing_testimonial_1: 'NutriFlow completely changed my relationship with food. I managed to lose 15kg without going hungry, just by learning to balance my macros.',
    landing_testimonial_2: 'As an athlete, precision is key. The AI integration to calculate calories in my routines has given me that competitive edge I was looking for.',
    landing_testimonial_3: 'I have recommended NutriFlow to my patients. It is a scientific and easy-to-use tool that really helps maintain commitment.',
    sub_feature_ai_training: 'AI Powered Training',
    landing_footer_made_with: 'Made with',
    landing_footer_for_wellness: 'for your wellness',
  },
  es: {
    nav_dashboard: 'Dashboard', nav_food: 'Alimentos', nav_exercise: 'Ejercicio',
    nav_history: 'Historial', nav_articles: 'Artículos', nav_chat: 'Chat IA',
    nav_profile: 'Perfil', nav_subscription: 'Suscripción', nav_settings: 'Ajustes',
    nav_logout: 'Cerrar sesión',
    auth_login: 'Iniciar sesión', auth_register: 'Registrarse', auth_free_start: 'Comenzar gratis',
    auth_email: 'Email', auth_password: 'Contraseña', auth_remember: 'Mantenme conectado',
    auth_forgot: '¿Olvidaste tu contraseña?', auth_no_account: '¿No tienes cuenta?',
    auth_create_account: 'Crea una cuenta gratis', auth_already_account: '¿Ya tienes cuenta?',
    auth_db_error: 'Problema de conexión', auth_db_error_desc: 'No se completó el chequeo a la BD. Revisa variables de entorno.',
    auth_too_many_attempts: 'Demasiados intentos. Inténtalo más tarde.', auth_unlocked_at: 'Desbloqueado en:',
    auth_welcome_back: 'Bienvenido de nuevo', auth_login_subtitle: 'Inicia sesión para continuar tu progreso.',
    auth_register_subtitle: 'Únete a NutriFlow y comienza tu transformación.',
    auth_loading: 'Iniciando sesión...', auth_health_rules: 'Tu Salud, Tus Reglas',
    auth_health_rules_desc: 'Desbloquea el acceso a la plataforma más avanzada impulsada por IA. Hábitos, métricas y nutrición en perfecta armonía.',
    auth_start_now: 'Comenzar Ahora', auth_steps: 'Paso', auth_step_of: 'de',
    auth_name: 'Nombre completo', auth_age: 'Edad', auth_sex: 'Sexo', auth_male: 'Hombre', auth_female: 'Mujer',
    auth_weight: 'Peso (kg)', auth_height: 'Altura (cm)', auth_activity_title: 'Actividad física actual',
    auth_goal_title: 'Tu objetivo',
    auth_activity_sedentary: 'Sedentario', auth_activity_sedentary_desc: 'Poco o nada de ejercicio',
    auth_activity_light: 'Ligero', auth_activity_light_desc: 'Ejercicio 1-3 días/semana',
    auth_activity_moderate: 'Moderate', auth_activity_moderate_desc: 'Ejercicio 3-5 días/semana',
    auth_activity_active: 'Activo', auth_activity_active_desc: 'Ejercicio 6-7 días/semana',
    auth_activity_very_active: 'Muy activo', auth_activity_very_active_desc: 'Ejercicio muy intenso',
    auth_goal_lose: 'Perder peso', auth_goal_maintain: 'Mantener peso', auth_goal_gain: 'Ganar músculo',
    auth_back: 'Atrás', auth_continue: 'Continuar', auth_creating: 'Creando cuenta...',
    auth_terms_agree: 'Al registrarte, confirmas tu acuerdo con nuestros', auth_terms: 'Términos', auth_privacy: 'Política de Privacidad',
    landing_features: 'Características', landing_pricing: 'Precios', landing_testimonials: 'Testimonio',
    common_loading: 'Cargando…', common_error: 'Error', common_save: 'Guardar',
    common_cancel: 'Cancelar', common_delete: 'Eliminar', common_confirm: 'Confirmar',
    common_search: 'Buscar', common_add: 'Agregar', common_edit: 'Editar', common_close: 'Cerrar',
    common_back: 'Volver', common_next: 'Siguiente', common_yes: 'Sí', common_no: 'No',
    common_premium: 'Premium', common_free: 'Gratis',
    common_days: 'días', common_date: 'Fecha',
    dash_welcome: 'Bienvenido de nuevo', dash_today: 'Hoy', dash_calories: 'Calorías',
    dash_protein: 'Proteínas', dash_carbs: 'Carbohidratos', dash_fat: 'Grasas',
    dash_water: 'Agua', dash_steps: 'Pasos', dash_weekly: 'Progreso semanal',
    dash_avg: 'PROMEDIO',
    food_log: 'Registro de alimentos', food_search: 'Buscar alimento…', food_add: 'Agregar alimento',
    food_breakfast: 'Desayuno', food_lunch: 'Almuerzo', food_dinner: 'Cena',
    food_snack: 'Snack', food_kcal: 'kcal',
    ex_log: 'Registro de ejercicio', ex_add: 'Agregar ejercicio', ex_duration: 'Duración (min)',
    ex_calories_burned: 'Calorías quemadas', ex_type: 'Tipo', ex_date: 'Fecha',
    chat_placeholder: 'Pregúntale a NutriFlow IA…', chat_send: 'Enviar',
    chat_limit: 'Límite de mensajes alcanzado', chat_wait: 'Espera {h}h {m}m para continuar',
    chat_clear: 'Limpiar historial',
    chat_suggest_1: '¿Qué debo comer para perder peso?',
    chat_suggest_2: 'Mejores ejercicios para ganar músculo',
    chat_suggest_3: 'Plan de comida saludable para la semana',
    chat_suggest_4: '¿Cuánta agua debo beber al día?',
    chat_suggest_5: 'Consejos de nutrición pre-entreno',
    chat_suggest_6: '¿Cómo mejorar la calidad del sueño?',
    chat_conversations: 'Conversaciones',
    chat_asistant_name: 'NutriFlow IA',
    chat_error_message: 'Error al procesar tu mensaje',
    chat_api_error: 'Servicio de IA temporalmente no disponible',
    chat_limit_title: 'Mensajes restantes',
    chat_limit_unlimited: 'Ilimitado',
    chat_limit_warning: 'Límite diario de mensajes alcanzado',
    chat_welcome_title: 'Tu Asistente de Nutrición IA',
    chat_welcome_subtitle: 'Pregúntame sobre nutrición, ejercicio y vida saludable',
    chat_input_placeholder: 'Pregúntame sobre nutrición, ejercicio o hábitos saludables...',
    all_items: 'Ver todo',
    sub_title: 'Elige tu plan', sub_free: 'Gratis', sub_premium: 'Elite',
    sub_pro: 'Máximo', sub_month: '/mes', sub_year: '/año',
    sub_get_premium: 'Obtener Elite',
    sub_current: 'Plan actual',
    sub_upgrade: 'Mejorar plan',
    sub_status_active: 'Activa',
    sub_status_canceled: 'Cancelada',
    sub_period_end: 'Vence el',
    sub_billing_upcoming: 'Próximo Pago',
    sub_billing_details: 'Detalles de Facturación',
    sub_billing_history: 'Historial de Pagos',
    sub_help_title: '¿Necesitas Ayuda?',
    sub_help_desc: 'Si tienes problemas con tu suscripción, contacta a soporte.',
    sub_help_cta: 'Soporte 24/7',
    sub_cancel_plan: 'Cancelar Suscripción',
    sub_cancel_scheduled: 'Tu suscripción se cancelará al final del período actual.',
    sub_access_until: 'Acceso hasta:',
    sub_access_until_info: 'Seguirás teniendo acceso hasta el final de tu período de facturación actual.',
    sub_change_plan: 'Cambiar Plan',
    sub_faq_title: 'Preguntas Frecuentes',
    sub_faq_q1: '¿Puedo cancelar?',
    sub_faq_a1: 'Sí, en cualquier momento desde ajustes.',
    sub_faq_q2: '¿Es seguro?',
    sub_faq_a2: 'Usamos PayPal con encriptación de nivel bancario.',
    sub_faq_q3: '¿Hay reembolsos?',
    sub_faq_a3: 'Garantía de 14 días en todos los planes.',
    sub_faq_q4: '¿Puedo cambiar de plan?',
    sub_faq_a4: 'Sí, puedes actualizar o reducir tu plan en cualquier momento.',
    sub_upgrade_confirm: '¿Mejorar tu Plan?',
    sub_change_confirm: '¿Cambiar de Plan?',
    sub_upgrade_desc: 'Al mejorar tendrás acceso a todas las nuevas funciones de inmediato.',
    sub_change_desc: 'Cambiar de plan cancelará tu plan actual y activará el nuevo.',
    sub_cancel_warning: 'Tu plan actual se cancelará al final del período de facturación.',
    set_acc_delete: 'Eliminar Cuenta',
    set_acc_delete_confirm: '¿Estás seguro de que quieres eliminar tu cuenta?',
    common_wait: 'Espera',
    set_notif_title: 'Notificaciones',
    set_notif_push: 'Notificaciones Push',
    set_notif_email: 'Correo Electrónico',
    set_notif_weekly: 'Reportes Semanales',
    set_app_title: 'Personalización',
    set_app_mode: 'Modo Oscuro',
    set_app_lang: 'Idioma de Interfaz',
    set_priv_title: 'Privacidad y Datos',
    set_priv_share: 'Compartir Datos Anónimos',
    set_priv_export: 'Exportar mi Información (JSON)',
    prof_danger_zone: 'Cuenta y Seguridad',
    prof_logout_desc: 'Has cerrado sesión correctamente',
    art_title: 'Biblioteca de Salud',
    art_subtitle: 'Aprende los secretos de la nutrición moderna con artículos verificados por expertos.',
    art_with_ads: 'Modo con Anuncios',
    art_verified: 'Verificado',
    art_read_min: 'min de lectura',
    art_read_more: 'Leer Ahora',
    art_empty: 'No se encontraron artículos',
    art_article_not_found: 'Artículo no encontrado',
    art_link_copied: 'Enlace copiado',
    art_author: 'Autor',
    art_sources: 'Fuentes y Referencias',
    sub_success_title: '¡Pago Exitoso!',
    sub_success_subtitle: 'Tu suscripción ha sido activada',
    sub_success_message: 'Gracias por actualizar tu plan. Ahora tienes acceso a todas las funciones de tu nuevo plan.',
    sub_success_dashboard: 'Ir al Dashboard',
    sub_success_explore: 'Explorar Funciones',
    sub_verify_payment: 'Verificando tu pago...',
    sub_verify_error: 'No pudimos verificar tu pago. Por favor contacta a soporte.',
    sub_verify_back: 'Volver a suscripciones',
    sub_plan_free_name: 'Esencial',
    sub_plan_premium_name: 'Elite',
    sub_plan_pro_name: 'Máximo',
    sub_plan_free_desc: 'Ideal para comenzar tu camino',
    sub_plan_premium_desc: 'Para usuarios comprometidos con resultados',
    sub_plan_pro_desc: 'Potencia total para atletas de alto rendimiento',
    sub_upgrade_premium: 'Unirse a Elite',
    sub_get_pro: 'Obtener Máximo',
    sub_feature_chat_limit: '10 mensajes IA por día',
    sub_feature_chat_unlimited: 'Chat IA Ilimitado',
    sub_feature_expert_articles: 'Artículos de Expertos',
    sub_feature_all_premium: 'Todo lo incluido en Elite',
    sub_feature_detailed_nutrition: 'Análisis Detallado de Macros',
    sub_feature_wearables: 'Integración con Wearables',
    sub_feature_no_ads: 'Experiencia sin anuncios',
    sub_status_free: 'Plan Gratis',
    sub_current_plan: 'Plan Actual',
    sub_free_desc: 'Comienza tu camino al bienestar',
    sub_free_gift: 'Regalo Gratis',
    sub_free_options_title: 'Opciones Gratuitas',
    sub_free_refferal: 'Referido',
    sub_free_student: 'Estudiante',
    sub_feature_unlimited_history: 'Historial Ilimitado',
    sub_feature_priority_support: 'Soporte Prioritario',
    profile_activity: 'Nivel de Actividad',
    profile_activity_active: 'Activo',
    profile_activity_light: 'Ligero',
    profile_activity_moderate: 'Moderado',
    profile_activity_sedentary: 'Sedentario',
    profile_activity_very_active: 'Muy Activo',
    common_date: 'Fecha', common_days: 'días',
    common_user: 'Usuario', common_wait: 'Espere',
    comming_soon: 'Próximamente',
    food_nutrient_density: 'Densidad Nutricional',
    food_bev_coffee: 'Café', food_bev_juice: 'Jugo', food_bev_milk: 'Leche', food_bev_tea: 'Té',
    common_contact: 'Contacto',
    prof_title: 'Perfil', prof_name: 'Nombre completo', prof_email: 'Correo electrónico',
    prof_avatar: 'Avatar', prof_save: 'Guardar cambios',
    set_title: 'Ajustes', set_notifications: 'Notificaciones', set_theme: 'Tema',
    set_language: 'Idioma', set_dark: 'Oscuro', set_light: 'Claro',
    sidebar_tagline: 'Tu salud, simplificada',
    dash_greet: 'Hola',
    dash_macros: 'Macronutrientes',
    dash_progress_msg: 'Tu progreso de hoy está luciendo excelente. Sigue así.',
    dash_activity_level: 'Nivel de Actividad',
    dash_weekly_subtitle: 'Calorías consumidas vs quemadas (estimación)',
    dash_macros_subtitle: 'Desglose de tu ingesta actual',
    dash_register_food: 'Registrar nuevo alimento',
    dash_action_dietary: 'Dietario',
    dash_action_dietary_desc: 'Registra tus próximas comidas y snacks',
    dash_action_exercise: 'Entrenamiento',
    dash_action_exercise_desc: 'Añade tu progreso en el gimnasio',
    dash_action_analytics: 'Analítica Avanzada',
    dash_action_analytics_desc: 'Explora tu historia mes a mes',
    dash_update_data: 'Actualizar datos',
    dash_no_weekly_data: 'Sin datos esta semana',
    dash_no_weekly_data_desc: 'Registra alimentos y ejercicio para ver tu progreso',
    dash_no_macro_data: 'Sin datos aún — registra tu primera comida',
    dash_avg: 'PROMEDIO',
    food_log_title: 'Bitácora de Salud',
    food_log_subtitle: 'Control preciso de comida e hidratación',
    food_daily_consumption: 'Consumo Diario',
    food_yesterday: 'Ayer',
    food_tomorrow: 'Mañana',
    food_search_placeholder: 'Tacos, Pizza, Pollo...',
    food_verified: 'Verificado',
    food_serving_size: 'Tamaño de porción',
    food_serving_pieces: 'Por piezas',
    food_serving_grams: 'Por gramos',
    food_register_success: '¡Alimento registrado!',
    food_register_error: 'Error al registrar alimento',
    food_delete_confirm: '¿Estás seguro de eliminar este registro?',
    food_water_title: 'Hidratación',
    food_water_goal: 'Meta: 2.5L',
    food_water_history: 'Historial de agua',
    food_water_add_success: '¡Agua registrada!',
    food_bev_coffee: 'Café',
    food_bev_tea: 'Té',
    food_bev_juice: 'Jugo/Soda',
    food_bev_milk: 'Lácteo',
    ex_title: 'Ejercicio',
    ex_subtitle: 'Registra tu actividad',
    ex_type_cardio: 'Cardio',
    ex_type_strength: 'Fuerza',
    ex_type_flexibility: 'Flexibilidad',
    ex_type_hiit: 'HIIT',
    ex_muscle_chest: 'Pecho',
    ex_muscle_back: 'Espalda',
    ex_muscle_shoulders: 'Hombros',
    ex_muscle_biceps: 'Bíceps',
    ex_muscle_triceps: 'Tríceps',
    ex_muscle_abs: 'Abdomen',
    ex_muscle_quads: 'Cuádriceps',
    ex_muscle_glutes: 'Glúteos',
    ex_muscle_calves: 'Pantorrillas',
    ex_exercise_squat: 'Sentadilla',
    ex_exercise_bench: 'Press de banca',
    ex_exercise_deadlift: 'Peso muerto',
    ex_exercise_press: 'Press militar',
    ex_exercise_running: 'Correr',
    ex_exercise_walking: 'Caminar',
    ex_add_success: '¡Ejercicio registrado!',
    sub_paypal_loading: 'Conectando de forma segura con PayPal...',
    sub_paypal_error: 'Error de conexión con PayPal',
    sub_paypal_verify: 'Verificando pago...',
    sub_feature_ai: 'Nutriólogo IA Avanzado',
    sub_feature_history: 'Historial ilimitado',
    sub_feature_ads: 'Sin anuncios',
    landing_hero_title: 'Domina tu nutrición',
    landing_hero_subtitle: 'La forma más inteligente de cuidar tu salud',
    landing_start_button: 'Empezar ahora',
    landing_feat_smart: 'Registro Inteligente',
    landing_feat_smart_desc: 'Controla tu dieta con IA que reconoce alimentos automáticamente.',
    landing_feat_premium: 'Entrenamiento Premium',
    landing_feat_premium_desc: 'Rutinas personalizadas con cálculos automáticos de calorías.',
    landing_feat_ai_coach: 'Coach IA 24/7',
    landing_feat_ai_coach_desc: 'Tu asistente personal de nutrición, siempre disponible.',
    landing_feat_analytics: 'Analítica Avanzada',
    landing_feat_analytics_desc: 'Visualiza tu progreso con gráficos y tendencias detalladas.',
    landing_feat_verified: 'Información Verificada',
    landing_feat_verified_desc: 'Contenido revisado por profesionales certificados.',
    landing_feat_science: 'Ciencia Precisa',
    landing_feat_science_desc: 'Fórmulas validadas como Mifflin-St Jeor para máxima precisión.',
    landing_prices_title: 'Desempeño sin concesiones',
    landing_prices_subtitle: 'Elige el plan que potenciará tus metas.',
    landing_row_kcal: 'Registro de Calorías',
    landing_row_water: 'Análisis de Hidratación',
    landing_row_ai_limit: 'Límite de Coach IA',
    landing_row_history: 'Historial de Progreso',
    landing_row_vision: 'Reconocimiento IA por Imágenes',
    landing_row_ads: 'Sin Anuncios',
    landing_row_routines: 'Rutinas con IA',
    landing_row_export: 'Exportación de Datos (PDF)',
    landing_footer_brand: 'Tu compañero inteligente para una vida más saludable.',
    landing_footer_product: 'Producto',
    landing_footer_company: 'Compañía',
    landing_footer_legal: 'Legal',
    landing_testimonial_1: 'NutriFlow cambió por completo mi relación con la comida. Logré bajar 15kg sin pasar hambre, solo aprendiendo a equilibrar mis macros.',
    landing_testimonial_2: 'Como atleta, la precisión es clave. La integración de IA para calcular calorías en mis rutinas me ha dado esa ventaja competitiva que buscaba.',
    landing_testimonial_3: 'He recomendado NutriFlow a mis pacientes. Es una herramienta científica y fácil de usar que realmente ayuda a mantener el compromiso.',
    sub_feature_ai_training: 'Entrenamiento con IA',
    landing_footer_made_with: 'Hecho con',
    landing_footer_for_wellness: 'para tu bienestar',
  },
  fr: {
    nav_dashboard: 'Tableau de bord', nav_food: 'Aliments', nav_exercise: 'Exercice',
    nav_history: 'Historique', nav_articles: 'Articles', nav_chat: 'Chat IA',
    nav_profile: 'Profil', nav_subscription: 'Abonnement', nav_settings: 'Paramètres',
    nav_logout: 'Déconnexion',
    auth_login: 'Connexion', auth_register: "S'inscrire", auth_free_start: 'Commencer gratuitement',
    landing_features: 'Fonctionnalités', landing_pricing: 'Tarifs',
    common_loading: 'Chargement…', common_error: 'Erreur', common_save: 'Enregistrer',
    common_cancel: 'Annuler', common_delete: 'Supprimer', common_confirm: 'Confirmer',
    common_search: 'Rechercher', common_add: 'Ajouter', common_edit: 'Modifier', common_close: 'Fermer',
    common_back: 'Retour', common_next: 'Suivant', common_yes: 'Oui', common_no: 'Non',
    common_premium: 'Premium', common_free: 'Gratuit',
    dash_welcome: 'Bon retour', dash_today: "Aujourd'hui", dash_calories: 'Calories',
    dash_protein: 'Protéines', dash_carbs: 'Glucides', dash_fat: 'Graisses',
    dash_water: 'Eau', dash_steps: 'Pas', dash_weekly: 'Progrès hebdomadaire',
    food_log: 'Journal alimentaire', food_search: 'Rechercher un aliment…', food_add: 'Ajouter un aliment',
    food_breakfast: 'Petit-déjeuner', food_lunch: 'Déjeuner', food_dinner: 'Dîner',
    food_snack: 'Collation', food_kcal: 'kcal',
    ex_log: "Journal d'exercice", ex_add: 'Ajouter exercice', ex_duration: 'Durée (min)',
    ex_calories_burned: 'Calories brûlées', ex_type: 'Type', ex_date: 'Date',
    chat_placeholder: "Demandez à l'IA NutriFlow…", chat_send: 'Envoyer',
    chat_limit: 'Limite de messages atteinte', chat_wait: 'Attendez {h}h {m}m pour continuer',
    chat_clear: "Effacer l'historique",
    sub_title: 'Choisissez votre plan', sub_free: 'Gratuit', sub_premium: 'Premium',
    sub_pro: 'Pro', sub_month: '/mois', sub_year: '/an',
    sub_get_premium: 'Obtenir Premium', sub_current: 'Plan actuel', sub_upgrade: 'Mettre à niveau',
    prof_title: 'Profil', prof_name: 'Nom complet', prof_email: 'E-mail',
    prof_avatar: 'Avatar', prof_save: 'Enregistrer les modifications',
    set_title: 'Paramètres', set_notifications: 'Notifications', set_theme: 'Thème',
    set_language: 'Langue', set_dark: 'Sombre', set_light: 'Clair',
    sidebar_tagline: 'Votre santé, simplifiée',
  },
  de: {
    nav_dashboard: 'Dashboard', nav_food: 'Lebensmittel', nav_exercise: 'Training',
    nav_history: 'Verlauf', nav_articles: 'Artikel', nav_chat: 'KI-Chat',
    nav_profile: 'Profil', nav_subscription: 'Abonnement', nav_settings: 'Einstellungen',
    nav_logout: 'Abmelden',
    auth_login: 'Anmelden', auth_register: 'Registrieren', auth_free_start: 'Kostenlos starten',
    landing_features: 'Funktionen', landing_pricing: 'Preise',
    common_loading: 'Laden…', common_error: 'Fehler', common_save: 'Speichern',
    common_cancel: 'Abbrechen', common_delete: 'Löschen', common_confirm: 'Bestätigen',
    common_search: 'Suchen', common_add: 'Hinzufügen', common_edit: 'Bearbeiten', common_close: 'Schließen',
    common_back: 'Zurück', common_next: 'Weiter', common_yes: 'Ja', common_no: 'Nein',
    common_premium: 'Premium', common_free: 'Kostenlos',
    dash_welcome: 'Willkommen zurück', dash_today: 'Heute', dash_calories: 'Kalorien',
    dash_protein: 'Protein', dash_carbs: 'Kohlenhydrate', dash_fat: 'Fett',
    dash_water: 'Wasser', dash_steps: 'Schritte', dash_weekly: 'Wöchentlicher Fortschritt',
    food_log: 'Ernährungsprotokoll', food_search: 'Lebensmittel suchen…', food_add: 'Lebensmittel hinzufügen',
    food_breakfast: 'Frühstück', food_lunch: 'Mittagessen', food_dinner: 'Abendessen',
    food_snack: 'Snack', food_kcal: 'kcal',
    ex_log: 'Trainingsprotokoll', ex_add: 'Training hinzufügen', ex_duration: 'Dauer (Min.)',
    ex_calories_burned: 'Verbrannte Kalorien', ex_type: 'Typ', ex_date: 'Datum',
    chat_placeholder: 'NutriFlow KI fragen…', chat_send: 'Senden',
    chat_limit: 'Nachrichtenlimit erreicht', chat_wait: '{h}h {m}m warten',
    chat_clear: 'Verlauf löschen',
    sub_title: 'Plan wählen', sub_free: 'Kostenlos', sub_premium: 'Premium',
    sub_pro: 'Pro', sub_month: '/Monat', sub_year: '/Jahr',
    sub_get_premium: 'Premium holen', sub_current: 'Aktueller Plan', sub_upgrade: 'Upgraden',
    prof_title: 'Profil', prof_name: 'Vollständiger Name', prof_email: 'E-Mail',
    prof_avatar: 'Avatar', prof_save: 'Änderungen speichern',
    set_title: 'Einstellungen', set_notifications: 'Benachrichtigungen', set_theme: 'Design',
    set_language: 'Sprache', set_dark: 'Dunkel', set_light: 'Hell',
    sidebar_tagline: 'Deine Gesundheit, vereinfacht',
  },
  pt: {
    nav_dashboard: 'Painel', nav_food: 'Alimentos', nav_exercise: 'Exercício',
    nav_history: 'Histórico', nav_articles: 'Artigos', nav_chat: 'Chat IA',
    nav_profile: 'Perfil', nav_subscription: 'Assinatura', nav_settings: 'Configurações',
    nav_logout: 'Sair',
    auth_login: 'Entrar', auth_register: 'Cadastrar', auth_free_start: 'Começar grátis',
    landing_features: 'Recursos', landing_pricing: 'Preços',
    common_loading: 'Carregando…', common_error: 'Erro', common_save: 'Salvar',
    common_cancel: 'Cancelar', common_delete: 'Excluir', common_confirm: 'Confirmar',
    common_search: 'Pesquisar', common_add: 'Adicionar', common_edit: 'Editar', common_close: 'Fechar',
    common_back: 'Voltar', common_next: 'Próximo', common_yes: 'Sim', common_no: 'Não',
    common_premium: 'Premium', common_free: 'Grátis',
    dash_welcome: 'Bem-vindo de volta', dash_today: 'Hoje', dash_calories: 'Calorias',
    dash_protein: 'Proteína', dash_carbs: 'Carboidratos', dash_fat: 'Gordura',
    dash_water: 'Água', dash_steps: 'Passos', dash_weekly: 'Progresso semanal',
    food_log: 'Diário alimentar', food_search: 'Buscar alimento…', food_add: 'Adicionar alimento',
    food_breakfast: 'Café da manhã', food_lunch: 'Almoço', food_dinner: 'Jantar',
    food_snack: 'Lanche', food_kcal: 'kcal',
    ex_log: 'Diário de exercícios', ex_add: 'Adicionar exercício', ex_duration: 'Duração (min)',
    ex_calories_burned: 'Calorias queimadas', ex_type: 'Tipo', ex_date: 'Data',
    chat_placeholder: 'Pergunte à IA NutriFlow…', chat_send: 'Enviar',
    chat_limit: 'Limite de mensagens atingido', chat_wait: 'Aguarde {h}h {m}m para continuar',
    chat_clear: 'Limpar histórico',
    sub_title: 'Escolha seu plano', sub_free: 'Grátis', sub_premium: 'Premium',
    sub_pro: 'Pro', sub_month: '/mês', sub_year: '/ano',
    sub_get_premium: 'Obter Premium', sub_current: 'Plano atual', sub_upgrade: 'Fazer upgrade',
    prof_title: 'Perfil', prof_name: 'Nome completo', prof_email: 'E-mail',
    prof_avatar: 'Avatar', prof_save: 'Salvar alterações',
    set_title: 'Configurações', set_notifications: 'Notificações', set_theme: 'Tema',
    set_language: 'Idioma', set_dark: 'Escuro', set_light: 'Claro',
    sidebar_tagline: 'Sua saúde, simplificada',
  },
  it: {
    nav_dashboard: 'Dashboard', nav_food: 'Alimenti', nav_exercise: 'Esercizio',
    nav_history: 'Cronologia', nav_articles: 'Articoli', nav_chat: 'Chat IA',
    nav_profile: 'Profilo', nav_subscription: 'Abbonamento', nav_settings: 'Impostazioni',
    nav_logout: 'Esci',
    auth_login: 'Accedi', auth_register: 'Registrati', auth_free_start: 'Inizia gratis',
    landing_features: 'Funzionalità', landing_pricing: 'Prezzi',
    common_loading: 'Caricamento…', common_error: 'Errore', common_save: 'Salva',
    common_cancel: 'Annulla', common_delete: 'Elimina', common_confirm: 'Conferma',
    common_search: 'Cerca', common_add: 'Aggiungi', common_edit: 'Modifica', common_close: 'Chiudi',
    common_back: 'Indietro', common_next: 'Avanti', common_yes: 'Sì', common_no: 'No',
    common_premium: 'Premium', common_free: 'Gratis',
    dash_welcome: 'Bentornato', dash_today: 'Oggi', dash_calories: 'Calorie',
    dash_protein: 'Proteine', dash_carbs: 'Carboidrati', dash_fat: 'Grassi',
    dash_water: 'Acqua', dash_steps: 'Passi', dash_weekly: 'Progresso settimanale',
    food_log: 'Diario alimentare', food_search: 'Cerca alimento…', food_add: 'Aggiungi alimento',
    food_breakfast: 'Colazione', food_lunch: 'Pranzo', food_dinner: 'Cena',
    food_snack: 'Spuntino', food_kcal: 'kcal',
    ex_log: 'Diario esercizi', ex_add: 'Aggiungi esercizio', ex_duration: 'Durata (min)',
    ex_calories_burned: 'Calorie bruciate', ex_type: 'Tipo', ex_date: 'Data',
    chat_placeholder: "Chiedi all'IA NutriFlow…", chat_send: 'Invia',
    chat_limit: 'Limite messaggi raggiunto', chat_wait: 'Attendi {h}h {m}m per continuare',
    chat_clear: 'Cancella cronologia',
    sub_title: 'Scegli il tuo piano', sub_free: 'Gratis', sub_premium: 'Premium',
    sub_pro: 'Pro', sub_month: '/mese', sub_year: '/anno',
    sub_get_premium: 'Ottieni Premium', sub_current: 'Piano attuale', sub_upgrade: 'Aggiorna',
    prof_title: 'Profilo', prof_name: 'Nome completo', prof_email: 'E-mail',
    prof_avatar: 'Avatar', prof_save: 'Salva modifiche',
    set_title: 'Impostazioni', set_notifications: 'Notifiche', set_theme: 'Tema',
    set_language: 'Lingua', set_dark: 'Scuro', set_light: 'Chiaro',
    sidebar_tagline: 'La tua salute, semplificata',
  },
  zh: {
    nav_dashboard: '仪表板', nav_food: '饮食', nav_exercise: '运动',
    nav_history: '历史', nav_articles: '文章', nav_chat: 'AI 聊天',
    nav_profile: '个人资料', nav_subscription: '订阅', nav_settings: '设置',
    nav_logout: '退出登录',
    auth_login: '登录', auth_register: '注册', auth_free_start: '免费开始',
    landing_features: '功能', landing_pricing: '价格',
    common_loading: '加载中…', common_error: '错误', common_save: '保存',
    common_cancel: '取消', common_delete: '删除', common_confirm: '确认',
    common_search: '搜索', common_add: '添加', common_edit: '编辑', common_close: '关闭',
    common_back: '返回', common_next: '下一步', common_yes: '是', common_no: '否',
    common_premium: '高级版', common_free: '免费',
    dash_welcome: '欢迎回来', dash_today: '今天', dash_calories: '卡路里',
    dash_protein: '蛋白质', dash_carbs: '碳水化合物', dash_fat: '脂肪',
    dash_water: '饮水', dash_steps: '步数', dash_weekly: '每周进度',
    food_log: '饮食日记', food_search: '搜索食物…', food_add: '添加食物',
    food_breakfast: '早餐', food_lunch: '午餐', food_dinner: '晚餐',
    food_snack: '零食', food_kcal: '千卡',
    ex_log: '运动日记', ex_add: '添加运动', ex_duration: '时长（分钟）',
    ex_calories_burned: '消耗卡路里', ex_type: '类型', ex_date: '日期',
    chat_placeholder: '询问 NutriFlow AI…', chat_send: '发送',
    chat_limit: '消息已达上限', chat_wait: '等待 {h}h {m}m 后继续',
    chat_clear: '清除历史记录',
    sub_title: '选择您的计划', sub_free: '免费', sub_premium: '高级版',
    sub_pro: '专业版', sub_month: '/月', sub_year: '/年',
    sub_get_premium: '获取高级版', sub_current: '当前计划', sub_upgrade: '升级',
    prof_title: '个人资料', prof_name: '全名', prof_email: '电子邮件',
    prof_avatar: '头像', prof_save: '保存更改',
    set_title: '设置', set_notifications: '通知', set_theme: '主题',
    set_language: '语言', set_dark: '深色', set_light: '浅色',
    sidebar_tagline: '您的健康，简单化',
  },
  ja: {
    nav_dashboard: 'ダッシュボード', nav_food: '食事', nav_exercise: '運動',
    nav_history: '履歴', nav_articles: '記事', nav_chat: 'AIチャット',
    nav_profile: 'プロフィール', nav_subscription: 'サブスクリプション', nav_settings: '設定',
    nav_logout: 'ログアウト',
    auth_login: 'ログイン', auth_register: '登録', auth_free_start: '無料で始める',
    landing_features: '機能', landing_pricing: '料金',
    common_loading: '読み込み中…', common_error: 'エラー', common_save: '保存',
    common_cancel: 'キャンセル', common_delete: '削除', common_confirm: '確認',
    common_search: '検索', common_add: '追加', common_edit: '編集', common_close: '閉じる',
    common_back: '戻る', common_next: '次へ', common_yes: 'はい', common_no: 'いいえ',
    common_premium: 'プレミアム', common_free: '無料',
    dash_welcome: 'おかえりなさい', dash_today: '今日', dash_calories: 'カロリー',
    dash_protein: 'タンパク質', dash_carbs: '炭水化物', dash_fat: '脂質',
    dash_water: '水分', dash_steps: '歩数', dash_weekly: '週間進捗',
    food_log: '食事記録', food_search: '食品を検索…', food_add: '食品を追加',
    food_breakfast: '朝食', food_lunch: '昼食', food_dinner: '夕食',
    food_snack: 'スナック', food_kcal: 'kcal',
    ex_log: '運動記録', ex_add: '運動を追加', ex_duration: '時間（分）',
    ex_calories_burned: '消費カロリー', ex_type: 'タイプ', ex_date: '日付',
    chat_placeholder: 'NutriFlow AIに質問…', chat_send: '送信',
    chat_limit: 'メッセージ上限に達しました', chat_wait: '{h}時間{m}分待ってください',
    chat_clear: '履歴を消去',
    sub_title: 'プランを選択', sub_free: '無料', sub_premium: 'プレミアム',
    sub_pro: 'プロ', sub_month: '/月', sub_year: '/年',
    sub_get_premium: 'プレミアムを取得', sub_current: '現在のプラン', sub_upgrade: 'アップグレード',
    prof_title: 'プロフィール', prof_name: '氏名', prof_email: 'メール',
    prof_avatar: 'アバター', prof_save: '変更を保存',
    set_title: '設定', set_notifications: '通知', set_theme: 'テーマ',
    set_language: '言語', set_dark: 'ダーク', set_light: 'ライト',
    sidebar_tagline: 'あなたの健康をシンプルに',
  },
  ko: {
    nav_dashboard: '대시보드', nav_food: '식품', nav_exercise: '운동',
    nav_history: '기록', nav_articles: '기사', nav_chat: 'AI 채팅',
    nav_profile: '프로필', nav_subscription: '구독', nav_settings: '설정',
    nav_logout: '로그아웃',
    auth_login: '로그인', auth_register: '회원가입', auth_free_start: '무료로 시작',
    landing_features: '기능', landing_pricing: '요금제',
    common_loading: '로딩 중…', common_error: '오류', common_save: '저장',
    common_cancel: '취소', common_delete: '삭제', common_confirm: '확인',
    common_search: '검색', common_add: '추가', common_edit: '수정', common_close: '닫기',
    common_back: '뒤로', common_next: '다음', common_yes: '예', common_no: '아니오',
    common_premium: '프리미엄', common_free: '무료',
    dash_welcome: '다시 오신 것을 환영합니다', dash_today: '오늘', dash_calories: '칼로리',
    dash_protein: '단백질', dash_carbs: '탄수화물', dash_fat: '지방',
    dash_water: '수분', dash_steps: '걸음', dash_weekly: '주간 진행상황',
    food_log: '식사 일지', food_search: '식품 검색…', food_add: '식품 추가',
    food_breakfast: '아침', food_lunch: '점심', food_dinner: '저녁',
    food_snack: '간식', food_kcal: 'kcal',
    ex_log: '운동 일지', ex_add: '운동 추가', ex_duration: '시간 (분)',
    ex_calories_burned: '소모 칼로리', ex_type: '종류', ex_date: '날짜',
    chat_placeholder: 'NutriFlow AI에게 물어보세요…', chat_send: '전송',
    chat_limit: '메시지 한도 도달', chat_wait: '{h}시간 {m}분 후 계속할 수 있습니다',
    chat_clear: '기록 지우기',
    sub_title: '플랜 선택', sub_free: '무료', sub_premium: '프리미엄',
    sub_pro: '프로', sub_month: '/월', sub_year: '/년',
    sub_get_premium: '프리미엄 받기', sub_current: '현재 플랜', sub_upgrade: '업그레이드',
    prof_title: '프로필', prof_name: '전체 이름', prof_email: '이메일',
    prof_avatar: '아바타', prof_save: '변경사항 저장',
    set_title: '설정', set_notifications: '알림', set_theme: '테마',
    set_language: '언어', set_dark: '다크', set_light: '라이트',
    sidebar_tagline: '당신의 건강, 단순하게',
  },
  ar: {
    nav_dashboard: 'لوحة التحكم', nav_food: 'الأطعمة', nav_exercise: 'التمارين',
    nav_history: 'السجل', nav_articles: 'المقالات', nav_chat: 'دردشة الذكاء الاصطناعي',
    nav_profile: 'الملف الشخصي', nav_subscription: 'الاشتراك', nav_settings: 'الإعدادات',
    nav_logout: 'تسجيل الخروج',
    auth_login: 'تسجيل الدخول', auth_register: 'إنشاء حساب', auth_free_start: 'ابدأ مجاناً',
    landing_features: 'المميزات', landing_pricing: 'الأسعار',
    common_loading: 'جار التحميل…', common_error: 'خطأ', common_save: 'حفظ',
    common_cancel: 'إلغاء', common_delete: 'حذف', common_confirm: 'تأكيد',
    common_search: 'بحث', common_add: 'إضافة', common_edit: 'تعديل', common_close: 'إغلاق',
    common_back: 'رجوع', common_next: 'التالي', common_yes: 'نعم', common_no: 'لا',
    common_premium: 'مميز', common_free: 'مجاني',
    dash_welcome: 'مرحباً بعودتك', dash_today: 'اليوم', dash_calories: 'السعرات الحرارية',
    dash_protein: 'البروتين', dash_carbs: 'الكربوهيدرات', dash_fat: 'الدهون',
    dash_water: 'الماء', dash_steps: 'الخطوات', dash_weekly: 'التقدم الأسبوعي',
    food_log: 'سجل الطعام', food_search: 'ابحث عن طعام…', food_add: 'إضافة طعام',
    food_breakfast: 'الفطور', food_lunch: 'الغداء', food_dinner: 'العشاء',
    food_snack: 'وجبة خفيفة', food_kcal: 'سعرة حرارية',
    ex_log: 'سجل التمارين', ex_add: 'إضافة تمرين', ex_duration: 'المدة (دقيقة)',
    ex_calories_burned: 'السعرات المحروقة', ex_type: 'النوع', ex_date: 'التاريخ',
    chat_placeholder: 'اسأل NutriFlow AI…', chat_send: 'إرسال',
    chat_limit: 'تم الوصول إلى حد الرسائل', chat_wait: 'انتظر {h} ساعة و {m} دقيقة للمتابعة',
    chat_clear: 'مسح السجل',
    sub_title: 'اختر خطتك', sub_free: 'مجاني', sub_premium: 'مميز',
    sub_pro: 'احترافي', sub_month: '/شهر', sub_year: '/سنة',
    sub_get_premium: 'احصل على المميز', sub_current: 'الخطة الحالية', sub_upgrade: 'ترقية',
    prof_title: 'الملف الشخصي', prof_name: 'الاسم الكامل', prof_email: 'البريد الإلكتروني',
    prof_avatar: 'الصورة الرمزية', prof_save: 'حفظ التغييرات',
    set_title: 'الإعدادات', set_notifications: 'الإشعارات', set_theme: 'المظهر',
    set_language: 'اللغة', set_dark: 'داكن', set_light: 'فاتح',
    sidebar_tagline: 'صحتك، ببساطة',
  },
  hi: {
    nav_dashboard: 'डैशबोर्ड', nav_food: 'खाद्य पदार्थ', nav_exercise: 'व्यायाम',
    nav_history: 'इतिहास', nav_articles: 'लेख', nav_chat: 'AI चैट',
    nav_profile: 'प्रोफ़ाइल', nav_subscription: 'सदस्यता', nav_settings: 'सेटिंग्स',
    nav_logout: 'लॉग आउट',
    auth_login: 'लॉग इन', auth_register: 'साइन अप', auth_free_start: 'मुफ्त शुरू करें',
    landing_features: 'विशेषताएं', landing_pricing: 'मूल्य निर्धारण',
    common_loading: 'लोड हो रहा है…', common_error: 'त्रुटि', common_save: 'सहेजें',
    common_cancel: 'रद्द करें', common_delete: 'हटाएं', common_confirm: 'पुष्टि करें',
    common_search: 'खोजें', common_add: 'जोड़ें', common_edit: 'संपादित करें', common_close: 'बंद करें',
    common_back: 'वापस', common_next: 'अगला', common_yes: 'हाँ', common_no: 'नहीं',
    common_premium: 'प्रीमियम', common_free: 'मुफ्त',
    dash_welcome: 'वापस स्वागत है', dash_today: 'आज', dash_calories: 'कैलोरी',
    dash_protein: 'प्रोटीन', dash_carbs: 'कार्बोहाइड्रेट', dash_fat: 'वसा',
    dash_water: 'पानी', dash_steps: 'कदम', dash_weekly: 'साप्ताहिक प्रगति',
    food_log: 'खाद्य लॉग', food_search: 'खाना खोजें…', food_add: 'खाना जोड़ें',
    food_breakfast: 'नाश्ता', food_lunch: 'दोपहर का भोजन', food_dinner: 'रात का खाना',
    food_snack: 'नाश्ता', food_kcal: 'kcal',
    ex_log: 'व्यायाम लॉग', ex_add: 'व्यायाम जोड़ें', ex_duration: 'अवधि (मिनट)',
    ex_calories_burned: 'जली हुई कैलोरी', ex_type: 'प्रकार', ex_date: 'तारीख',
    chat_placeholder: 'NutriFlow AI से पूछें…', chat_send: 'भेजें',
    chat_limit: 'संदेश सीमा पहुंच गई', chat_wait: '{h}h {m}m प्रतीक्षा करें',
    chat_clear: 'इतिहास साफ़ करें',
    sub_title: 'अपना प्लान चुनें', sub_free: 'मुफ्त', sub_premium: 'प्रीमियम',
    sub_pro: 'प्रो', sub_month: '/माह', sub_year: '/वर्ष',
    sub_get_premium: 'प्रीमियम पाएं', sub_current: 'वर्तमान प्लान', sub_upgrade: 'अपग्रेड',
    prof_title: 'प्रोफ़ाइल', prof_name: 'पूरा नाम', prof_email: 'ईमेल',
    prof_avatar: 'अवतार', prof_save: 'बदलाव सहेजें',
    set_title: 'सेटिंग्स', set_notifications: 'सूचनाएं', set_theme: 'थीम',
    set_language: 'भाषा', set_dark: 'डार्क', set_light: 'लाइट',
    sidebar_tagline: 'आपकी सेहत, सरल बनाई',
  },
  ru: {
    nav_dashboard: 'Панель', nav_food: 'Питание', nav_exercise: 'Упражнения',
    nav_history: 'История', nav_articles: 'Статьи', nav_chat: 'ИИ-чат',
    nav_profile: 'Профиль', nav_subscription: 'Подписка', nav_settings: 'Настройки',
    nav_logout: 'Выйти',
    auth_login: 'Войти', auth_register: 'Зарегистрироваться', auth_free_start: 'Начать бесплатно',
    landing_features: 'Возможности', landing_pricing: 'Цены',
    common_loading: 'Загрузка…', common_error: 'Ошибка', common_save: 'Сохранить',
    common_cancel: 'Отмена', common_delete: 'Удалить', common_confirm: 'Подтвердить',
    common_search: 'Поиск', common_add: 'Добавить', common_edit: 'Изменить', common_close: 'Закрыть',
    common_back: 'Назад', common_next: 'Далее', common_yes: 'Да', common_no: 'Нет',
    common_premium: 'Премиум', common_free: 'Бесплатно',
    dash_welcome: 'С возвращением', dash_today: 'Сегодня', dash_calories: 'Калории',
    dash_protein: 'Белки', dash_carbs: 'Углеводы', dash_fat: 'Жиры',
    dash_water: 'Вода', dash_steps: 'Шаги', dash_weekly: 'Недельный прогресс',
    food_log: 'Дневник питания', food_search: 'Поиск продукта…', food_add: 'Добавить продукт',
    food_breakfast: 'Завтрак', food_lunch: 'Обед', food_dinner: 'Ужин',
    food_snack: 'Перекус', food_kcal: 'ккал',
    ex_log: 'Журнал упражнений', ex_add: 'Добавить упражнение', ex_duration: 'Длительность (мин)',
    ex_calories_burned: 'Сожжённые калории', ex_type: 'Тип', ex_date: 'Дата',
    chat_placeholder: 'Спросите NutriFlow AI…', chat_send: 'Отправить',
    chat_limit: 'Лимит сообщений достигнут', chat_wait: 'Подождите {h}ч {m}мин',
    chat_clear: 'Очистить историю',
    sub_title: 'Выберите план', sub_free: 'Бесплатно', sub_premium: 'Премиум',
    sub_pro: 'Про', sub_month: '/мес', sub_year: '/год',
    sub_get_premium: 'Получить Премиум', sub_current: 'Текущий план', sub_upgrade: 'Обновить',
    prof_title: 'Профиль', prof_name: 'Полное имя', prof_email: 'Email',
    prof_avatar: 'Аватар', prof_save: 'Сохранить изменения',
    set_title: 'Настройки', set_notifications: 'Уведомления', set_theme: 'Тема',
    set_language: 'Язык', set_dark: 'Тёмная', set_light: 'Светлая',
    sidebar_tagline: 'Ваше здоровье, упрощённое',
  },
};

export default t;
