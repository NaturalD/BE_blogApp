from django.views.generic import TemplateView
from django.db.models import Count, Q
from django.views.generic import ListView
from django.shortcuts import redirect
from .mixins import EditorRequiredMixin
from django.views.generic.edit import UpdateView
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy
from .forms import ArticleForm
from .models import Writer, Article
from datetime import datetime, timedelta
from rest_framework import generics
from .serializers import UserRegistrationSerializer
from rest_framework import viewsets, permissions
from .serializers import ArticleSerializer, WriterSerializer
from .permissions import IsEditorOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.views import LoginView
from .serializers import WriterSerializer

class DashboardView(TemplateView):
    template_name = 'dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        writers = Writer.objects.annotate(
            total_articles=Count('articles_written'),
            articles_last_30=Count(
                'articles_written',
                filter=Q(
                    articles_written__created_at__gte=datetime.now() - timedelta(days=30)
                )
            )
        )
        context['writers'] = writers
        return context

class ArticleCreateView(CreateView):
    model = Article
    form_class = ArticleForm
    template_name = 'blog_app/article_create.html'
    success_url = reverse_lazy('dashboard')

    def form_valid(self, form):
        form.instance.written_by = self.request.user.writer
        return super().form_valid(form)

class ArticleDetailView(UpdateView):
    model = Article
    form_class = ArticleForm
    template_name = 'blog_app/article_detail.html'

    def get_queryset(self):
        return Article.objects.all()

class ArticleApprovalView(EditorRequiredMixin, ListView):
    model = Article
    template_name = 'blog_app/article_approval.html'
    context_object_name = 'articles'

    def get_queryset(self):
        return Article.objects.filter(status='pending')

    def post(self, request, *args, **kwargs):
        article_id = request.POST.get('article_id')
        action = request.POST.get('action')
        article = Article.objects.get(id=article_id)
        article.status = action
        article.edited_by = request.user.writer
        article.save()
        return redirect('article-approval')

class ArticlesEditedView(EditorRequiredMixin, ListView):
    model = Article
    template_name = 'blog_app/articles_edited.html'
    context_object_name = 'articles'

    def get_queryset(self):
        return Article.objects.filter(edited_by=self.request.user.writer)

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.writer.is_editor:
                return Article.objects.all()
            else:
                return Article.objects.filter(written_by=user.writer)
        else:
            return Article.objects.none()

    def perform_create(self, serializer):
        serializer.save(written_by=self.request.user.writer)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        elif self.action == 'create':
            return [permissions.IsAuthenticated()]
        else:
            return [permissions.AllowAny()]

    # Custom action for article approval
    @action(detail=False, methods=['get', 'post'], permission_classes=[IsEditorOrReadOnly])
    def approval(self, request):
        if request.method == 'GET':
            # Get articles pending approval
            articles = Article.objects.filter(status='pending')
            serializer = self.get_serializer(articles, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            # Approve or reject an article
            article_id = request.data.get('article_id')
            action = request.data.get('action')
            article = Article.objects.get(id=article_id)
            article.status = action
            article.edited_by = request.user.writer
            article.save()
            return Response({'status': 'Article updated'})

class WriterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Writer.objects.all()
    serializer_class = WriterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomLoginView(LoginView):
    template_name = 'blog_app/login.html'

    def get_success_url(self):
        if self.request.user.writer:
            return reverse_lazy('article-create')
        return reverse_lazy('dashboard')
