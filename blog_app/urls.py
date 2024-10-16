
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, WriterViewSet, UserRegistrationView
from django.contrib.auth import views as auth_views
from .views import (
    DashboardView,
    ArticleCreateView,
    ArticleDetailView,
    ArticleApprovalView,
    ArticlesEditedView,
)



router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'writers', WriterViewSet)

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('', include(router.urls)),
    path('article/create/', ArticleCreateView.as_view(), name='article-create'),
    path('article/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
    path('article-approval/', ArticleApprovalView.as_view(), name='article-approval'),
    path('articles-edited/', ArticlesEditedView.as_view(), name='articles-edited'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='blog_app/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
]
