"""djangoproj URL Configuration

This file defines the primary URL dispatching for the entire Django project.
It separates explicit API routes from the general Single Page Application (SPA) routes.
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

# Defines the main URL patterns for the project
urlpatterns = [
    # 1. Administration and Explicit API Routes (Must remain explicit)
    # These paths are handled directly by Django views (Backend logic).
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),

    # 2. Catch-All Route for Frontend (Must be the last entry)
    # This path serves the React application's single entry point (index.html)
    # for all UI-related routes (e.g., /, /about, /dealers).
    # The (?!...) is a "negative lookahead" that ensures this pattern does not capture
    # the 'admin/' or 'djangoapp/' paths, preventing conflicts.
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
